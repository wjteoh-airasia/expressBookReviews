const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js"); 
const regd_users = express.Router();

let users = []; 


const JWT_SECRET = 'your_jwt_secret_key'; 

// Function to check if a username is valid
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Function to authenticate user credentials
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the user exists and credentials are correct
  if (authenticatedUser(username, password)) {
    // Generate a JWT token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ message: 'Login successful', token });
  } else {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Add or update a book review
regd_users.patch("/auth/review/:isbn", (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract the token from the header
  const { isbn } = req.params; // Get ISBN from the URL parameters
  const { review } = req.body; // Get the review from the request body

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const { username } = decoded;

    // Find the book by ISBN
    const book = books.find(b => b.isbn === isbn);

    if (book) {
      // Add or update the review for the book
      book.reviews = book.reviews || {};
      book.reviews[username] = review;
      return res.json({ message: 'Review added/updated successfully', reviews: book.reviews });
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; 
  const { isbn } = req.params; 

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const { username } = decoded;

    // Find the book by ISBN
    const book = books.find(b => b.isbn === isbn);

    if (book) {
      // Check if the review exists and belongs to the user
      if (book.reviews && book.reviews[username]) {
        // Delete the review
        delete book.reviews[username];
        return res.json({ message: 'Review deleted successfully', reviews: book.reviews });
      } else {
        return res.status(404).json({ message: 'Review not found for this user' });
      }
    } else {
      return res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
