const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // Check if username exists and is not empty
  return username !== undefined && username.trim() !== "";
}

const authenticatedUser = (username, password)=>{ //returns boolean
  // Find user in the users array
  const user = users.find(user => user.username === username && user.password === password);
  return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are valid
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Authenticate user
  if (authenticatedUser(username, password)) {
    // Create JWT token
    const accessToken = jwt.sign({
      data: username
    }, "access", { expiresIn: 60 * 60 });
    
    // Store token in session
    req.session.authorization = {
      accessToken
    };
    
    // Return success with token
    return res.status(200).json({
      message: "User successfully logged in",
      accessToken: accessToken,
      username: username
    });
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  // Get review from body parameters or query parameters
  const review = req.body.review || req.query.review;
  if (!review) {
    return res.status(400).json({message: "Review text is required"});
  }
  
  // Get username from the JWT token data
  const username = req.user.data;
  
  // Check if book exists
  if (books[isbn]) {
    // Add or update the review under the user's name
    books[isbn].reviews[username] = review;
    
    // Send formatted response
    return res.status(200).json({
      message: "Review added/updated successfully",
      book: isbn,
      user: username,
      review: review
    });
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  
  // Get username from the JWT token data
  const username = req.user.data;
  
  // Check if book exists
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  
  // Check if the user has a review for this book
  if (books[isbn].reviews[username]) {
    // Delete the review
    delete books[isbn].reviews[username];
    return res.status(200).json({
      message: "Review deleted successfully",
      book: isbn,
      user: username
    });
  } else {
    return res.status(404).json({message: "Review not found or you don't have permission to delete this review"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
