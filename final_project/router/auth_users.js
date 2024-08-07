const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const SECRET_KEY = "random_secret_key"; // Use a strong secret key

const isValid = (username) => {
  //returns boolean
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  const user = users.find((user) => user.username === username);
  return user && user.password === password;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Authenticate user
  if (!authenticatedUser(username, password)) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  // Generate JWT
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

  // Store token in session
  req.session.token = token;
  // Return the token
  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.user.username;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }
  books[isbn].reviews[username] = review;
  return res.status(300).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews,
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const token = req.session.token;
  const username = req.user.username;

  if (!token) {
    return res
      .status(401)
      .json({ message: "No token provided. Please log in." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the review exists
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  // Delete the review
  delete books[isbn].reviews[username];
  res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
