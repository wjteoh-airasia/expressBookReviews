const express = require('express');

const books = require("./booksdb.js");
const { users, isValid } = require("./auth_users.js");
const { default: axios } = require('axios');

const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (isValid(username)) {
      users.push({
        username,
        password
      });
      return res.status(200).json({ message: "User succesfully registered. You can login now 🎉" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(400).json({ message: "Missing username / password" });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: "Book not found" });
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const { author } = req.params;

  const filteredBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase());

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  }

  return res.status(404).json({ message: `Not founded books by author: ${author}` });
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const { title } = req.params;

  const filteredBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  }

  return res.status(404).json({ message: `Not founded books by title: ${title}` });
});

//  Get book review
public_users.get('/review/:isbn', async (req, res) => {
  const { isbn } = req.params;

  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews);
  }

  return res.status(404).json({ message: "Book not found" });
});

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (isValid(username)) {
      users.push({
        username,
        password
      });
      return res.status(200).json({ message: "User succesfully registered. You can login now 🎉" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(400).json({ message: "Missing username / password" });
});

/**
 * Tasks 10 - 13 (Using Axios)
 */

// Get the book list available in the shop
public_users.get('/v2', async (req, res) => {
  try {
    const response = await axios.get("BOOK-URL"); // replace with a valid API URL
    const books = response.data;
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error });
  }
});

// Get book details based on ISBN
public_users.get('/v2/isbn/:isbn', async (req, res) => {
  const { isbn } = req.params;
  try {
    const response = await axios.get(`BOOK-URL/isbn/${isbn}`); // replace with a valid API URL
    const book = response.data;
    if (book) {
      return res.status(200).json(book);
    }
    return res.status(404).json({ message: "Book not found" });
  } catch (error) {
    res.status(500).json({ message: "Error getting book", error });
  }
});

// Get book details based on author
public_users.get('/v2/author/:author', async (req, res) => {
  const { author } = req.params;

  try {
    const response = await axios.get(`BOOK-URL/author/${author}`); // replace with a valid API URL
    const booksByAuthor = response.data;

    if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
    }

    return res.status(404).json({ message: `Not founded books by author: ${author}` });
  } catch (error) {
    res.status(500).json({ message: "Error getting books", error });
  }
});

// Get all books based on title
public_users.get('/v2/title/:title', async (req, res) => {
  const { title } = req.params;

  try {
    const response = await axios.get(`BOOK-URL/author/${author}`); // replace with a valid API URL
    const booksByTitle = response.data;

    if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
    }

    return res.status(404).json({ message: `Not founded books by title: ${title}` });
  } catch (error) {
    res.status(500).json({ message: "Error getting books", error });
  }
});

module.exports.general = public_users;
