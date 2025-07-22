const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }

  const user = users.find((u) => u.username === username);

  if (user) {
    return res.status(400).json({ message: 'username already exists' });
  }

  users.push({ username, password });
  res.status(201).json({ message: 'user registered' });
});

// task 10-13 helper function
async function getBooksAsync() {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return books;
}

public_users.get('/', async function (req, res) {
  try {
    const bookList = await getBooksAsync();
    return res.status(200).json({ books: JSON.stringify(bookList) });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// task 11
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const books = await getBooksAsync();
    const book = books[req.params.isbn];
    return res.status(200).json({ book });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// task 12
public_users.get('/author/:author', async function (req, res) {
  try {
    const books = await getBooksAsync();
    const { author } = req.params;
    const book = Object.values(books).filter((obj) => obj.author === author);
    return res.status(200).json({ book });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// task 13
public_users.get('/title/:title', async function (req, res) {
  try {
    const books = await getBooksAsync();
    const { title } = req.params;
    const book = Object.values(books).filter((obj) => obj.title === title);
    return res.status(200).json({ book });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;

  const book = Object.values(books).filter(
    (obj) =>
      obj.title.toLowerCase() === title.split('-').join(' ').toLowerCase()
  );
  return res.status(200).json({ book });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { reviews } = books[req.params.isbn];
  return res.status(200).json({ reviews });
});

module.exports.general = public_users;
