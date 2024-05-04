const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  return users.findIndex(user => user.username === username) !== -1
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;
  
  // Validate username and password input
  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide both username and password.' });
  }
  
  // Check if the user exists
  if (!isValid(username)) {
    return res.status(401).json({ error: 'Invalid username.' });
  }
  
  const user = users.find(e => e.username === username);
  
  // Check if the password is correct
  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid password.' });
  }
  
  // Crear una sesión de usuario
  req.session.user = { username: user.username };
  
  // If username and password are correct, authentication successful
  const token = jwt.sign({ username }, 'express_books', { expiresIn: '2h' });
  res.json({ token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  const { user } = req.session;

  if (!book) {
    return { error: 'Book not found.' };
  }
  
  if (!book.reviews[user.username]) {
    book.reviews[user.username] = req.body?.review;
    return res.status(200).json({ message: 'Review added successfully.' });
  } else {
    // If the user already reviewed, update the review
    book.reviews[user.username] = req.body?.review;
    return res.status(200).json({ message: 'Review updated successfully.' });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { user } = req.session;
  
  // Verificar si el libro existe
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ error: 'Book not found.' });
  }
  
  // Verificar si el usuario ha dejado una reseña para este libro
  if (!book.reviews[user.username]) {
    return res.status(404).json({ error: 'User has not reviewed this book.' });
  }
  
  // Eliminar la reseña del usuario
  delete book.reviews[user.username];
  return res.status(200).json({ message: 'Review deleted successfully.' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
