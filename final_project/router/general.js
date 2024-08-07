const express = require('express');
const axios = require('axios'); // Add axios for async/await
const books = require('./booksdb.js'); // Your mock data

const public_users = express.Router();

// Function to simulate fetching books data using Axios
const fetchBooks = async () => {
  // Simulate fetching data
  return new Promise((resolve) => resolve(books));
};

// Task 10: Get the book list available in the shop using async/await with Axios
public_users.get('/', async (req, res) => {
  try {
    const bookList = await fetchBooks();
    res.status(200).json(bookList);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book list' });
  }
});

// Task 11: Get book details based on ISBN using async/await with Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const bookList = await fetchBooks();
    const book = bookList[isbn];
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found.", default: "No book available with the provided ISBN." });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book details' });
  }
});

// Task 12: Get book details based on author using async/await with Axios
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const bookList = await fetchBooks();
    const filteredBooks = Object.values(bookList).filter(book => book.author === author);
    if (filteredBooks.length > 0) {
      res.status(200).json(filteredBooks);
    } else {
      res.status(404).json({ message: "Books by this author not found." });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books by author' });
  }
});

// Task 13: Get book details based on title using async/await with Axios
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const bookList = await fetchBooks();
    const filteredBooks = Object.values(bookList).filter(book => book.title === title);
    if (filteredBooks.length > 0) {
      res.status(200).json(filteredBooks);
    } else {
      res.status(404).json({ message: "Books with this title not found." });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books by title' });
  }
});

module.exports.general = public_users;

