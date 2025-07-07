const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Add this line

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if username already exists
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists." });
  }

  // Register new user
  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop (original synchronous version)
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get the book list available in the shop using Promise callbacks (with Axios)
public_users.get('/books/promise', function (req, res) {
  // Simulate an async operation using Promise
  new Promise((resolve, reject) => {
    resolve(books);
  })
  .then(data => {
    res.status(200).send(JSON.stringify(data, null, 4));
  })
  .catch(err => {
    res.status(500).json({ message: "Error retrieving books." });
  });
});

// Get the book list available in the shop using async-await (with Axios)
public_users.get('/books/async', async function (req, res) {
  try {
    // Simulate an async operation (could be replaced with an actual Axios call)
    const getBooks = async () => books;
    const data = await getBooks();
    res.status(200).send(JSON.stringify(data, null, 4));
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books." });
  }
});

// Example: Using Axios to call the same server (for demonstration)
public_users.get('/books/axios', async function (req, res) {
  try {
    // Replace localhost:5000 with your actual server address if needed
    const response = await axios.get('http://localhost:5000/');
    res.status(200).send(response.data);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books via Axios." });
  }
});

// Get book details based on ISBN (original synchronous version)
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Get book details based on ISBN using Promise callbacks
public_users.get('/isbn-promise/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
  .then(book => res.status(200).send(JSON.stringify(book, null, 4)))
  .catch(err => res.status(404).json({ message: err }));
});

// Get book details based on ISBN using async-await (with Axios)
public_users.get('/isbn-async/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    // Simulate async fetch (could be replaced with an actual Axios call)
    const getBook = async () => books[isbn];
    const book = await getBook();
    if (book) {
      res.status(200).send(JSON.stringify(book, null, 4));
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error retrieving book." });
  }
});

// Example: Using Axios to call the same server for ISBN (for demonstration)
public_users.get('/isbn-axios/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
    // Replace localhost:5000 with your actual server address if needed
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).send(response.data);
  } catch (err) {
    res.status(404).json({ message: "Book not found via Axios." });
  }
});

// Get book details based on author (original synchronous version)
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  if (booksByAuthor.length > 0) {
    return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res.status(404).json({message: "No books found for the given author"});
  }
});

// Get book details based on author using Promise callbacks
public_users.get('/author-promise/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No books found for the given author");
    }
  })
  .then(booksByAuthor => res.status(200).send(JSON.stringify(booksByAuthor, null, 4)))
  .catch(err => res.status(404).json({ message: err }));
});

// Get book details based on author using async-await (with Axios)
public_users.get('/author-async/:author', async function (req, res) {
  const author = req.params.author;
  try {
    // Simulate async fetch (could be replaced with an actual Axios call)
    const getBooksByAuthor = async () => Object.values(books).filter(book => book.author === author);
    const booksByAuthor = await getBooksByAuthor();
    if (booksByAuthor.length > 0) {
      res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    } else {
      res.status(404).json({ message: "No books found for the given author" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books by author." });
  }
});

// Example: Using Axios to call the same server for author (for demonstration)
public_users.get('/author-axios/:author', async function (req, res) {
  const author = req.params.author;
  try {
    // Replace localhost:5000 with your actual server address if needed
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    res.status(200).send(response.data);
  } catch (err) {
    res.status(404).json({ message: "No books found for the given author via Axios." });
  }
});

// Get all books based on title (original synchronous version)
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title === title);
  if (booksByTitle.length > 0) {
    return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
  } else {
    return res.status(404).json({message: "No books found with the given title"});
  }
});

// Get all books based on title using Promise callbacks
public_users.get('/title-promise/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No books found with the given title");
    }
  })
  .then(booksByTitle => res.status(200).send(JSON.stringify(booksByTitle, null, 4)))
  .catch(err => res.status(404).json({ message: err }));
});

// Get all books based on title using async-await (with Axios)
public_users.get('/title-async/:title', async function (req, res) {
  const title = req.params.title;
  try {
    // Simulate async fetch (could be replaced with an actual Axios call)
    const getBooksByTitle = async () => Object.values(books).filter(book => book.title === title);
    const booksByTitle = await getBooksByTitle();
    if (booksByTitle.length > 0) {
      res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    } else {
      res.status(404).json({ message: "No books found with the given title" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books by title." });
  }
});

// Example: Using Axios to call the same server for title (for demonstration)
public_users.get('/title-axios/:title', async function (req, res) {
  const title = req.params.title;
  try {
    // Replace localhost:5000 with your actual server address if needed
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    res.status(200).send(response.data);
  } catch (err) {
    res.status(404).json({ message: "No books found with the given title via Axios." });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
