const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { JWT_SECRET } = require('../utils/constants.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  return !users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Error ligging in! Missing username / password" });
  }

  if (authenticatedUser(username, password)) {
    const payload = {
      username,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };

    return res.status(200).json({ message: "User successfully logged in" });
  }

  return res.status(400).json({ message: "User not registered!" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { username } = req.user;
  const { isbn } = req.params;
  const { review } = req.body;

  if (!review) {
    return res.status(400).json({ message: "No review in body" });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  book.reviews = {
    ...book.reviews,
    [username]: {
      review
    }
  };

  return res.status(200).json(book);
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.user;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  delete book.reviews[username];

  return res.status(200).json({ book });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
