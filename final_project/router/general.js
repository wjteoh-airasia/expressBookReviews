const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;
    if(username&&password){
        const present = users.filter((user)=> user.username === username)
        if(present.length===0){
            users.push({"username":req.body.username,"password":req.body.password});
            return res.status(201).json({message:"New user created"})
        }
        else{
          return res.status(400).json({message:"User already exists"})
        }
    }
    else if(!username && !password){
      return res.status(400).json({message:"Bad request"})
    }
    else if(!username || !password){
      return res.status(400).json({message:"Check username and password"})
    }  
  
   
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let myPromise1= new Promise((resolve,reject) =>{
        setTimeout(() =>{
            resolve(books)
        },0 )})
    myPromise1.then((successMessage)=>{
        res.send(JSON.stringify(books,null,4))
    })    
  //res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let myPromise1= new Promise((resolve,reject) =>{
        setTimeout(() =>{
            resolve(books)
        },0 )})
    myPromise1.then((successMessage)=>{
        const isbn = req.params.isbn
        res.send(books[isbn])
    })     
  
  
  //const isbn = req.params.isbn;
    //res.send(books[isbn])
  //return res.status(300).json({message: "ISBN"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let myPromise1= new Promise((resolve,reject) =>{
        setTimeout(() =>{
            resolve(books)
        },0 )})
    myPromise1.then((successMessage)=>{
        const authors = req.params.author
        let filtered_author = Object.values(books).filter(books => books.author === authors);
        res.send(filtered_author);
    })     
  
  
  
  //const authors = req.params.author;
  //let filtered_author = Object.values(books).filter(books => books.author === authors);
  //res.send(filtered_author);
  //return res.status(300).json({message: "Author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  public_users.get('/title/:title',function (req, res) {
    let myPromise1= new Promise((resolve,reject) =>{
        setTimeout(() =>{
            resolve(books)
        },0 )})
    myPromise1.then((successMessage)=>{
        const titles = req.params.title;
        let filtered_title = Object.values(books).filter(books => books.title === titles);
        res.send(filtered_title);
    })     
  
  
  
  //const titles = req.params.title;
  //let filtered_title = Object.values(books).filter(books => books.title === titles);
  //res.send(filtered_title);
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;  

  res.send(books[isbn].reviews)
 
  //return res.status(300).json({message: "Review via isbn"});
});

module.exports.general = public_users;
