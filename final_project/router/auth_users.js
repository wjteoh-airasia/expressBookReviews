const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { secretKey } = require('../config/index.js');
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some(u => u.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const userExists = users.some(u => u.username === username && u.password === password);

  return userExists;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  // Simulated user authentication

  if (authenticatedUser(username,password)) {
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    req.session.token = token;
    res.json({ token });
  } else {
    res.send('Invalid credentials');
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { review } = req.body;
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(400).json({message: "Book is not found"});
  }
  const user = req.session.user;

  if (!user) {
    return res.status(400).json({message: "User is not found"});
  }

  book.reviews[user] = review;

  return res.status(200).json({message: "Review posted", updatedBook: book});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const book = books[isbn];

  if (!book) {
    return res.status(400).json({message: "Book is not found"});
  }
  const user = req.session.user;

  if (!user) {
    return res.status(400).json({message: "User is not found"});
  }

  book.reviews[user] = undefined;

  return res.status(200).json({message: "Review posted", updatedBook: book});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
