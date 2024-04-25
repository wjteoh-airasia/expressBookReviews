const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const param = req.params.isbn;
  res.send(JSON.stringify(books[param],null,4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const param = req.params.author;
  let matches = {};
  for (const [key, value] of Object.entries(books)) {
    if(value.author === param)
      matches[key] = value;
  }
  res.send(JSON.stringify(matches,null,4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const param = req.params.title;
  let matches = {};
  for (const [key, value] of Object.entries(books)) {
    if(value.title === param)
      matches[key] = value;
  }
  res.send(JSON.stringify(matches,null,4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const param = req.params.isbn;
  res.send(JSON.stringify(books[param].reviews,null,4));
});

module.exports.general = public_users;
