const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
}

const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check for missing credentials
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Authenticate user
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login credentials" });
  }

  // Generate JWT
  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

  // Save token and username in session
  req.session.authorization = {
    accessToken,
    username,
  };

  return res.status(200).json({ message: "User successfully logged in" });
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization?.username;
  
    // Check if user is logged in
    if (!username) {
      return res.status(401).json({ message: "Unauthorized: Please log in" });
    }
  
    // Validate input
    if (!review) {
      return res.status(400).json({ message: "Review is required in query" });
    }
  
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    // Add or update review
    books[isbn].reviews[username] = review;

    req.session.authorization = {
        accessToken,
        username,
      };
  
    return res.status(200).json({ 
      message: "Review added/updated successfully", 
      reviews: books[isbn].reviews 
    });
  
    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
