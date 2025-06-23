const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // Check if both fields are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Validate credentials
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Generate JWT
  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

  // Save token in session
  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({ message: "User successfully logged in." });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const token = req.headers['auth-token'];
  const username = getUsernameFromToken(token);
  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please login." });
  }
  const isbn = req.params.isbn;
  const review = req.query.review;
  if (!review) {
    return res.status(400).json({ message: "Review query parameter is required." });
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }
  if (!books[isbn].reviews) {
      books[isbn].reviews = {};
  }
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: `Review for book with ISBN ${isbn} has been added/updated` });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const token = req.headers['auth-token'];
  const username = getUsernameFromToken(token);
  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please login." });
  }
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }
  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user and ISBN." });
  }
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully." });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
