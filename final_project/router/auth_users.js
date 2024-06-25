const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  })
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = users[username];
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Username or password is incorrect' });
  }

  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(403).json({ error: 'Token not provided' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.username = decoded.username;
    next();
  });
}

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;

  // Check if review is provided
  if (!review) {
    return res.status(400).json({ error: 'Review text is required' });
  }

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Add the review to the book
  const reviewId = `review ${Object.keys(books[isbn].reviews).length + 1}`;
  books[isbn].reviews[reviewId] = review;

  // Return success message or updated book details
  res.json({ message: 'Review added successfully', book: books[isbn] });
});


// DELETE endpoint to delete a review
app.delete('/auth/review/:isbn', verifyToken, (req, res) => {
  const isbn = req.params.isbn;
  const { reviewId } = req.body;
  const username = req.username; // Username from JWT payload

  // Check if the reviewId is provided
  if (!reviewId) {
    return res.status(400).json({ error: 'Review ID is required' });
  }

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ error: 'Book not found' });
  }

  // Check if the review exists
  if (!books[isbn].reviews[reviewId]) {
    return res.status(404).json({ error: 'Review not found' });
  }

  // Check if the review belongs to the authenticated user
  if (books[isbn].reviews[reviewId].user !== username) {
    return res.status(403).json({ error: 'You are not authorized to delete this review' });
  }

  // Delete the review
  delete books[isbn].reviews[reviewId];

  // Return success message
  res.json({ message: 'Review deleted successfully' });
});

// Verify JWT middleware function
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).json({ error: 'Token not provided' });
  }

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.username = decoded.username; // Add username to request object
    next();
  });
}

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
