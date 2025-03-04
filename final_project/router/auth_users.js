const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Function to check if username exists
const isValid = (username) => {
  return users.hasOwnProperty(username);
};

// Function to authenticate user credentials
const authenticatedUser = (username, password) => {
  return isValid(username) && users[username].password === password;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Validate credentials
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  let token = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });

  // Save token in session
  req.session.authorization = { accessToken: token };

  return res.status(200).json({ message: "Login successful", token });
});

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get ISBN from request parameters
  const review = req.query.review; // Get review from query parameters

  // Check if user is authenticated
  if (!req.session || !req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  let username = req.session.authorization.username; // Retrieve username from session

  // Check if review text is provided
  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Add or update review
  if (!books[isbn].reviews) {
    books[isbn].reviews = {}; // Initialize reviews if not present
  }

  books[isbn].reviews[username] = review; // Save/Update the review for the user

  return res.status(200).json({ message: "Review added/updated successfully", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn; // Get ISBN from request parameters

  // Check if user is authenticated
  if (!req.session || !req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  let username = req.session.authorization.username; // Retrieve username from session

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the book has reviews
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "No review found to delete" });
  }

  // Delete user's review
  delete books[isbn].reviews[username];

  return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
