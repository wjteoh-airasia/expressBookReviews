const express = require('express');
const axios = require('axios');
const public_users = express.Router();
const books = require("./booksdb.js");

const BOOKS_API = 'http://localhost:5000'; // base API for axios

// Task 10: Get all books (with async/await)
public_users.get('/async/books', (req, res) => {
  new Promise((resolve) => {
    resolve(books);
  }).then((bookList) => {
    res.status(200).json(bookList);
  });
});


// Task 11: Get book details based on ISBN (with async/await)
public_users.get('/async/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  try {
    const book = await new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    });
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Task 12: Get book details based on Author (with async/await)
public_users.get('/async/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const matches = await new Promise((resolve, reject) => {
      const result = Object.values(books).filter(book => book.author === author);
      if (result.length > 0) resolve(result);
      else reject("No books found for this author");
    });
    res.status(200).json(matches);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});


// Task 13: Get book details based on Title (with async/await)
public_users.get('/async/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const matches = await new Promise((resolve, reject) => {
      const result = Object.values(books).filter(book => book.title === title);
      if (result.length > 0) resolve(result);
      else reject("No books found for this title");
    });
    res.status(200).json(matches);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});


module.exports.general = public_users;
