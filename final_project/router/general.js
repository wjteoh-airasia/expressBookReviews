const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  const userExists = (username) => {
    const getOne = users.filter(user => user.username === username)
    return getOne.length > 0
  }

  if (!userExists(username)){
    const newUser = {username,password}
    users = [...users, newUser]
    return res.status(201).json({message:"User created ",newUser})
  }
  return res.status(400).json({message:'User already taken.'})
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book){
    return res.status(400).json({message:"Book not found"})
  }
  return res.status(200).json(book)
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const value = req.params.author
  let details = [];
  for (let key of Object.keys(books)){
  
    if (books[key].author == value){
      details.push(books[key])
    }
  }
  if (details.length > 0){
      return res.status(200).json(details);
  }
    
  return res.status(400).json({message:"Books not found"});
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const matches = {}
  for (let key of Object.keys(books)){
    if (books[key].title == title){
      matches[key] = books[key]
    }
  }
  if (books){
    return res.status(200).json(matches)
  }
  return res.status(400).json({message:"Books not found"})

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book){
    return res.status(400).json({message:"Book not found"})
  }
  return res.status(200).json({reviews:book.reviews})
});

module.exports.general = public_users;
