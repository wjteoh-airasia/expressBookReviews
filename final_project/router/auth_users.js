const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // For secure password hashing

let books = require("./booksdb.js");

const regd_users = express.Router();

let users = []; // Consider using a database instead for user storage

// Function to validate username (optional, enhance with desired validation logic)
const isValid = (username) => {
  // Implement your username validation logic here (e.g., length, format)
  return username.length >= 5; // Example: Username must be at least 5 characters long
}

// Function to authenticate user credentials
const authenticatedUser = async (username, password) => {
  // Find the user by username
  const user = users.find(user => user.username === username);

  // Check if user exists
  if (!user) {
    return false;
  }

  // Compare password hashes securely using bcrypt
  const match = await bcrypt.compare(password, user.passwordHash);
  return match; // Returns true if passwords match, false otherwise
}

// Login endpoint (POST /customer/login) - (same as previous implementation)
regd_users.post("/login", async (req, res) => {
  // ... (existing login logic) ...
});

// Add or modify a book review (PUT /auth/review/:isbn) - (same as previous implementation)
regd_users.put("/auth/review/:isbn", async (req, res) => {
  // ... (existing review logic) ...
});

// Delete a book review (DELETE /auth/review/:isbn)
regd_users.delete("/auth/review/:isbn", async (req, res) => {
  const isbn = req.params.isbn;

  // Extract username from JWT token (assuming middleware to verify token)
  const username = req.user.username; // This assumes you have middleware to extract username from token

  if (!isbn) {
    return res.status(400).json({ message: "Missing ISBN" });
  }

  try {
    // Find the book by ISBN (replace with database lookup if applicable)
    const bookIndex = books.findIndex(book => book.isbn === isbn);
    if (bookIndex === -1) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Filter reviews to keep only those for the current user
    books[bookIndex].reviews = books[bookIndex].reviews.filter(rev => rev.username === username);

    // Save updated book data (replace with database update if applicable)
    // ... (code to save updated books data) ...

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users; // Consider using a database instead for user storage
