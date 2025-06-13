const express = require('express');
const axios = require('axios');
let books = require("../booksdb.js"); // local books object
const public_users = express.Router();

// (Task 10): Get all books using async/await + axios
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/internal/books');
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});

//(Task 11): Get book by ISBN using async/await + axios
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const response = await axios.get(`http://localhost:5000/internal/books/${isbn}`);
    return res.status(200).json(response.data);
  } catch (err) {
    return res.status(404).json({ message: "Book not found" });
  }
});

//(Task 12): Get books by author using async/await + axios
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author.toLowerCase();
  try {
    const response = await axios.get('http://localhost:5000/internal/books');
    const filtered = Object.values(response.data).filter(
      b => b.author.toLowerCase() === author
    );
    return res.status(200).json(filtered);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching author books" });
  }
});

//(Task 13): Get books by title using async/await + axios
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title.toLowerCase();
  try {
    const response = await axios.get('http://localhost:5000/internal/books');
    const filtered = Object.values(response.data).filter(
      b => b.title.toLowerCase() === title
    );
    return res.status(200).json(filtered);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching title books" });
  }
});

// Local access for axios to use
public_users.get('/internal/books', (req, res) => {
  res.status(200).json(books);
});

public_users.get('/internal/books/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) return res.status(200).json(book);
  else return res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
