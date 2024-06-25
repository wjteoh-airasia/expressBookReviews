const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Register the user
  users[username] = { password };

  // Send success response
  res.status(201).json({ message: 'User registered successfully' });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const books = await books.find({});
    res.send(JSON.stringify(books, null, 2));
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch books' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
      res.status(404).send({ error: 'Book not found' });
      return;
    }

    res.send(book);
  } catch (error) {
    console.error('Error fetching book', error);
    res.status(500).send({ error: 'Failed to fetch book' });
  }
});

const getBooksByAuthorAsync = async (author) => {
  return new Promise((resolve, reject) => {
    const matchingBooks = [];
    for (const key in books) {
      if (books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks.push(books[key]);
      }
    }
    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject({ message: "No books found by this author" });
    }
  });
};

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const matchingBooks = await getBooksByAuthorAsync(author);
    res.status(200).json(matchingBooks);
  } catch (error) {
    res.status(404).json(error);
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const matchingBooks = [];

  for (const key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  }
  if (matchingBooks.length > 0) {
    res.status(200).json(matchingBooks)
  } else {
    res.status(404).json({ message: "No matching books with this title were found" });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Find the book with the given ISBN
  const book = Object.values(books).find(book => book.isbn === isbn);

  // Check if the book with the given ISBN exists
  if (book) {
    const response = {
      title: book.title,
      reviews: book.reviews
    };
    res.json(response); // Sending the title and reviews as JSON response
  } else {
    res.status(404).send('Book not found'); // If book with given ISBN is not found
  }
});

module.exports.general = public_users;
