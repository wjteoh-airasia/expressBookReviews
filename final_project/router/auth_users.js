const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// ✅ Check if a username is valid (i.e., not already registered)
const isValid = (username) => {
  return !users.find(user => user.username === username);
};

// ✅ Check if the username and password match
const authenticatedUser = (username, password) => {
  return users.find(user => user.username === username && user.password === password);
};

// ✅ Login route (only registered users)
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  const accessToken = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });

  req.session.authorization = { accessToken, username };

  return res.status(200).json({ message: "Login successful!", token: accessToken });
});

// ✅ Add or update a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review text is required." });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully.", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
