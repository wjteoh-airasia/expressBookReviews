const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const fetchBooks = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(books), 100); // Simulate network delay
  });
};
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (users.find(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  try {
    const booksData = await fetchBooks();
    res.status(200).json(JSON.stringify(booksData, null, 2));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const booksData = await fetchBooks();
    const book = booksData[isbn];
    if (book) {
      res.status(200).json(JSON.stringify(book, null, 2));
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching book" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const booksData = await fetchBooks();
    const matchingBooks = Object.values(booksData).filter(book => book.author.toLowerCase() === author.toLowerCase());
    if (matchingBooks.length > 0) {
      res.status(200).json(JSON.stringify(matchingBooks, null, 2));
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const booksData = await fetchBooks();
    const matchingBooks = Object.values(booksData).filter(book => book.title.toLowerCase() === title.toLowerCase());
    if (matchingBooks.length > 0) {
      res.status(200).json(JSON.stringify(matchingBooks, null, 2));
    } else {
      res.status(404).json({ message: "No books found for this title" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    res.status(200).json(JSON.stringify(book.reviews, null, 2));
  } else {
    res.status(404).json({ message: "No reviews found for this book" });
  }
});

module.exports.general = public_users;
