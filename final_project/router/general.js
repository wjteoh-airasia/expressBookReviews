const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const {username, password} = req.body;
  
  if (!username) {
    return res.status(404).json({message: 'The username is required'});
  }
  if (!password) {
    return res.status(404).json({message: 'The password is required'});
  }
  if (users.find(user => user.username === username)) {
    return res.status(404).json({message: 'The user already exist, ${username}'});
  }
  users.push({username, password});

  return res.json({message: "User created"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  if (!req.params['isbn']) {
    return res.status(404).json({message: 'The isbn is required'});
  }

  const result = books[req.params['isbn']];
  if (result) {
    return res.json(result);
  }
  return res.status(404).json({message: "Not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const searchByAuthor = (books, title) => 
    Object.entries(books).filter(([id, book]) => book.author.toLowerCase() === title.toLowerCase()) || null;

  return res.json(searchByAuthor(books, req.params['author']));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const searchByTitle = (books, title) => 
    Object.entries(books).filter(([id, book]) => book.title.toLowerCase() === title.toLowerCase()) || null;

  return res.json(searchByTitle(books, req.params['title']));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const result = books[req.params['isbn']];
  if (result) {
    return res.json(result.reviews);
  }

  return res.status(404).json({message: "Not found"});
});

module.exports.general = public_users;
