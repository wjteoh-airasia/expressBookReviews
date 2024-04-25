const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// User Registration Endpoint
public_users.post("/register", (req,res) => {
  //Write your code here
  // Checks if user already exists.
  // Checks if username and password are not null.
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(403).json({message: "Unable to register user with provided credentials."});
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
