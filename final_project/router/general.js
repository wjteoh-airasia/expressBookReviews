const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios').default;

public_users.post("/register", (req,res) => { 
  if(req.body.username && req.body.password){
    let filteredUser = users.filter(user => user.username === req.body.username);
    if(filteredUser.length > 0){
      res.status(400)
      res.send("The username "+ req.body.username+ " is already exist")
    }else{
      users.push({
        "username":req.body.username,
        "password":req.body.password    
      });  
      res.send("The username "+ req.body.username+ " has been added")
    }
  }else{
    res.status(400)
    res.send("Please provide username / password")
  }
 
});

public_users.get('/users',function (req, res) {
  res.send(users);
});

public_users.get('/booksPromise',function (req, res) {
  let promise1 = new Promise((resolve, reject) =>{
    setTimeout(() => {
      resolve("Promise 1 resolved");
    }, 5000);
  })
  let promise2 = new Promise((resolve, reject )=>{
    setTimeout(() => {
      resolve("Promise 2 resolved");
    }, 2500);
  })
  promise1.then((successMessage) =>{
    promise2.then((successMessage) =>{
  res.send(books);
    })
  }) 
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN

public_users.get('/isbnAxios/:isbn',function (req, res) {
 let booksArray = [];
  for (const [key, value] of Object.entries(books)) {
    booksArray.push(value);
  }
  const isbn = req.params.isbn;
  const connectToURL = (url)=>{
    const req = axios.get(url);
    console.log(req);
    req.then(resp =>{
      console.log("Fulfilled");
      console.log(resp.data);
      res.send(resp.data);
    })
    .catch(err =>{
      console.log("Rejected for url "+url);
      console.log(err.toString());
      res.status(400)
      res.send("Rejected for url "+url)
    })
  }
  connectToURL('http://localhost:5000/isbnAxios/'+isbn);
  
 });
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let booksArray = [];
  for (const [key, value] of Object.entries(books)) {
    booksArray.push(value);
  }
  const isbn = req.params.isbn;
  console.log(isbn)
  let filtered_books = booksArray[isbn-1];
  res.send(filtered_books);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let booksArray = [];
  for (const [key, value] of Object.entries(books)) {
    booksArray.push(value);
  }
  const author = req.params.author;
  let filtered_books = booksArray.filter(book => book.author === author);
  res.send(filtered_books);
});

public_users.get('/authorPromise/:author',function (req, res) {
  let booksArray = [];
  for (const [key, value] of Object.entries(books)) {
    booksArray.push(value);
  }
  const author = req.params.author;
  let filtered_books = booksArray.filter(book => book.author === author);

  let promise1 = new Promise((resolve, reject) =>{
    setTimeout(() => {
      resolve("Promise 1 resolved");
    }, 5000);
  })
  let promise2 = new Promise((resolve, reject )=>{
    setTimeout(() => {
      resolve("Promise 2 resolved");
    }, 2500);
  })
  promise1.then((successMessage) =>{
    promise2.then((successMessage) =>{
      res.send(filtered_books);
    })
  }) 


});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let booksArray = [];
  for (const [key, value] of Object.entries(books)) {
    booksArray.push(value);
  }
  const title = req.params.title;
  let filtered_books = booksArray.filter(book => book.title === title);
  res.send(filtered_books);
});

public_users.get('/titleAxios/:title',function (req, res) {
  let booksArray = [];
  for (const [key, value] of Object.entries(books)) {
    booksArray.push(value);
  }
  const title = req.params.title;
  let filtered_books = booksArray.filter(book => book.title === title);
  const connectToURL = (url)=>{
    const req = axios.get(url);
    console.log(req);
    req.then(resp =>{
      console.log("Fulfilled");
      console.log(resp.data);
      res.send(resp.data);
    })
    .catch(err =>{
      console.log("Rejected for url "+url);
      console.log(err.toString());
      res.status(400)
      res.send("Rejected for url "+url)
    })
  }
  connectToURL('http://localhost:5000/titleAxios/'+title);

  res.send(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let booksArray = [];
  for (const [key, value] of Object.entries(books)) {
    booksArray.push(value);
  }
  const isbn = req.params.isbn;
  let filtered_books = booksArray[isbn-1];
  res.send(filtered_books.reviews);
});

module.exports.general = public_users;
