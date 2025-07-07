const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  // Check if username exists in users array
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
  // Check if username and password match a user in users array
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if user exists and password matches
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Generate JWT token
  let accessToken = jwt.sign(
    { username: username },
    "access", // Secret key
    { expiresIn: 60 * 60 } // 1 hour
  );

  // Save token in session
  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "User successfully logged in", token: accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  // Check if user is authenticated and username is in session
  if (!req.session.authorization || !req.session.authorization.username) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  const username = req.session.authorization.username;

  // Check if review is provided
  if (!review) {
    return res.status(400).json({ message: "Review is required." });
  }

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Add or update the review for the user
  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/modified successfully.", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  // Check if user is authenticated and username is in session
  if (!req.session.authorization || !req.session.authorization.username) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  const username = req.session.authorization.username;

  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Check if the user's review exists
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review by this user not found for this book." });
  }

  // Delete the user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully.", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
