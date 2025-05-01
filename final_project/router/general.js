const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();



// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  const userExists = users.find(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
  });
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    // Simulate Axios fetching data from internal books object
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found");
        }
      });
    };

    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});
  

// GET books by author using async/await and simulated Axios
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    // Simulate an Axios call using a Promise
    const getBooksByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const matchedBooks = Object.values(books).filter(book => book.author === author);
        if (matchedBooks.length > 0) {
          resolve(matchedBooks);
        } else {
          reject("No books found for the given author");
        }
      });
    };

    const authorBooks = await getBooksByAuthor(author);
    return res.status(200).json(authorBooks);

  } catch (error) {
    return res.status(404).json({ message: error });
  }
});
  

// Get all books based on title
// GET book details by Title using async/await and simulated Axios
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    // Simulate Axios call using a Promise
    const getBooksByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const matchedBooks = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
        if (matchedBooks.length > 0) {
          resolve(matchedBooks);
        } else {
          reject("No books found with the given title");
        }
      });
    };

    const booksByTitle = await getBooksByTitle(title);
    return res.status(200).json(booksByTitle);

  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
  
    if (book && book.reviews) {
      return res.status(200).json(book.reviews);
    } else {
      return res.status(404).json({ message: "Reviews not found for this book" });
    }
  });

  // Use async/await with Axios to fetch all books
public_users.get('/', async (req, res) => {
  try {
    // Simulating an Axios request to fetch books from local memory
    const fetchBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };

    const bookList = await fetchBooks();

    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book list", error: error.message });
  }
});



module.exports.general = public_users;
