const express = require('express');
let books = require("./booksdb.js");  // Importing the books from booksdb.js
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Removed redundant 'books' declaration

// Task 1: Get the book list available in the shop
public_users.get('/', (req, res) => {
    const booksList = JSON.stringify(books, null, 2);
    res.status(200).send(booksList);
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 3: Get books by author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;
    const filteredBooks = Object.values(books).filter(book => book.author === author);

    if (filteredBooks.length > 0) {
        res.status(200).json(filteredBooks);
    } else {
        res.status(404).json({ message: "No books found for this author" });
    }
});

// Task 4: Get books by title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title));

    if (filteredBooks.length > 0) {
        res.status(200).json(filteredBooks);
    } else {
        res.status(404).json({ message: "No books found with this title" });
    }
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        res.status(200).json({ reviews: book.reviews });
    } else {
        res.status(404).json({ message: "No reviews found for this book" });
    }
});

// Task 6: Register a new user
public_users.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users.push({ username, password });
    res.status(201).json({ message: "User registered successfully" });
});

// Task 10: Get the list of books using async/await
public_users.get('/', async (req, res) => {
  try {
      const response = await axios.get('http://localhost:5000/books');
      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching the list of books", error: error.message });
  }
});

// Task 11: Get book details by ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  axios.get(`http://localhost:5000/books/${isbn}`)
      .then(response => {
          res.status(200).json(response.data);
      })
      .catch(error => {
          res.status(500).json({ message: "Error fetching book details", error: error.message });
      });
});

// Task 12: Get book details by Author using async/await
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
      const response = await axios.get(`http://localhost:5000/books?author=${author}`);
      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching book details by author", error: error.message });
  }
});

// Task 13: Get book details by Title using Promises
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  axios.get(`http://localhost:5000/books?title=${title}`)
      .then(response => {
          res.status(200).json(response.data);
      })
      .catch(error => {
          res.status(500).json({ message: "Error fetching book details by title", error: error.message });
      });
});

module.exports.general = public_users;
