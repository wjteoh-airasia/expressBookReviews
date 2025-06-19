const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

// Simulate book data as if it's coming from an API endpoint
const fetchBooks = () => {
  return new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books not found");
    }
  });
};

// ✅ Task 10: Get all books (Async/Await)
public_users.get('/async-books', async (req, res) => {
  try {
    const allBooks = await fetchBooks();
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

// ✅ Task 11: Get book by ISBN (Async/Await)
public_users.get('/async-isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const allBooks = await fetchBooks();
    if (allBooks[isbn]) {
      return res.status(200).json(allBooks[isbn]);
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

// ✅ Task 12: Get books by author (Async/Await)
public_users.get('/async-author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const allBooks = await fetchBooks();
    const results = [];
    for (let key in allBooks) {
      if (allBooks[key].author === author) {
        results.push({ isbn: key, ...allBooks[key] });
      }
    }
    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(404).json({ message: "No books found by this author." });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

// ✅ Task 13: Get books by title (Async/Await)
public_users.get('/async-title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const allBooks = await fetchBooks();
    const results = [];
    for (let key in allBooks) {
      if (allBooks[key].title === title) {
        results.push({ isbn: key, ...allBooks[key] });
      }
    }
    if (results.length > 0) {
      return res.status(200).json(results);
    } else {
      return res.status(404).json({ message: "No books found with this title." });
    }
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

module.exports.general = public_users;
