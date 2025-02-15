const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password= req.body.password;

  if (username&&password){
    if (isValid(username)) {
      users.push({username:username,password:password})
      return res.status(200).send(JSON.stringify({message: "Registed successful"}) + "\n");
    }
    else {
      return res.status(404).json({ message: "Username already taken. Please choose a new username"});
    }
  }
  else {
    return res.status(400).json({ message: "Username or password not provided"});
  }
});

/* 
//old task 1
public_users.get('/', function (req, res) {
  if (books) {
    return res.status(200).send(JSON.stringify(books, null, 4));
  } else {
    return res.status(404).json({ message: "There is no book available" });
  }
});
*/

// Task 10
public_users.get('/',async function (req, res) {
  try {
    const books = await getBooks(); 
    res.status(200).send(JSON.stringify({ message: 'Task completed', books }, null, 4) + "\n")
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

const getBooks = () => {
  return new Promise((resolve, reject) => {
      resolve(books);
  });
};

/*
// task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  try{
    const book = books[isbn];
    res.status(200).send(JSON.stringify(response.data[isbn] , null, 4) + "\n");
  }
  catch{
    res.status(404).json({ message: "Book not found" });
  }
 });
 */

 //Task 11 
 public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  try {
    const books = await getBooks(); 
    if (books[isbn]){
      res.status(200).send(JSON.stringify({ message: 'Task completed', output: books[isbn]}, null, 4) + "\n")
    }
    else {
      res.status(404).send(JSON.stringify({ message: 'Book not found'}, null, 4) + "\n")
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
});

 /*
// task 2: Get book details based on author 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  
  let matchedbook = [];
  for(let isbn in books){
    if (books[isbn].author == author) {
      matchedbook.push(books[isbn])
    }
  }

  if (matchedbook.length>0) {
    return res.status(200).send(JSON.stringify(matchedbook, null, 4));
  }
  else{
    res.status(404).json({ message: "Book not found" });
  }
});
*/

// Task 12
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  const books = await getBooks(); 

  let matchedbook = [];
  for(let isbn in books){
    if (books[isbn].author == author) {
      matchedbook.push(books[isbn])
    }
  }

  if (matchedbook.length>0) {
    return res.status(200).send(JSON.stringify({ message: 'Task completed', matchedbook }, null, 4) + "\n")
  }
  else{
    res.status(404).json({ message: "Book not found" });
  }
});

/*
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  
  let matchedbook = [];
  for(let isbn in books){
    if (books[isbn].title == title) {
      matchedbook.push(books[isbn])
    }
  }

  if (matchedbook.length>0) {
    return res.status(200).send(JSON.stringify(matchedbook, null, 4));
  }
  else{
    res.status(404).json({ message: "Book not found" });
  }
});
*/

// Task 13
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
  const books = await getBooks(); 

  let matchedbook = [];
  for(let isbn in books){
    if (books[isbn].title == title) {
      matchedbook.push(books[isbn])
    }
  }

  if (matchedbook.length>0) {
    return res.status(200).send(JSON.stringify({ message: 'Task completed', matchedbook }, null, 4) + "\n")
  }
  else{
    res.status(404).json({ message: "Book not found" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  try{
    return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4) + "\n");
  }
  catch{
    res.status(404).json({ message: "Review not found with ISBN " + isbn });
  }
});

module.exports.general = public_users;
