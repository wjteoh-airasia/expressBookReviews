const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let userswithsamename = users.filter((user) => {
      return user.username === username;
    });
    return userswithsamename.length > 0;
  }
  
  const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
    });
    return validusers.length > 0;
  }

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });

      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Get the username from the session
  const username = req.session.authorization.username;
  // Get the ISBN from the request parameters
  const isbn = req.params.isbn;
  // Get the review text from the request query
  const reviewText = req.query.review;

  // Check if review text is provided
  if (!reviewText) {
    return res.status(400).json({ message: "Review text is required." });
  }

  // Check if the book exists
  if (books[isbn]) {
    let book = books[isbn];
    // Add or update the review using the username as the key
    book.reviews[username] = reviewText;
    return res.status(200).json({
        message: "Review successfully added/updated.",
        reviews: book.reviews // Return all reviews for the book
    });
  } else {
    // If book not found
    return res.status(404).json({ message: "Unable to find book with that ISBN." });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // Get the username from the session
  const username = req.session.authorization.username;
  // Get the ISBN from the request parameters
  const isbn = req.params.isbn;

  // Check if the book exists
  if (books[isbn]) {
    let book = books[isbn];
    // Check if the user has a review for this book
    if (book.reviews[username]) {
      // Delete the user's review
      delete book.reviews[username];
      return res.status(200).json({
          message: "Review successfully deleted.",
          reviews: book.reviews
      });
    } else {
      return res.status(404).json({ message: "No review found for this user." });
    }
  } else {
    return res.status(404).json({ message: "Unable to find book with that ISBN." });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
