const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body; // Extract username and password from request body

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  if (users[username]) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users[username] = { password: password };
  return res.status(201).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
// Get the book list available in the shop using async/await
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/booksdb");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;  // Retrieve ISBN from request parameters
  let book = books[isbn];  // Search for the book in books database

  if (book) {
    return res.status(200).json(book);  // Return book details if found
  } else {
    return res.status(404).json({ message: "Book not found" });  // Handle case where book does not exist
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author.toLowerCase(); // Retrieve author name from request parameters (case insensitive)
  let booksList = Object.values(books); // Convert 'books' object to an array of book objects

  let filteredBooks = booksList.filter(book => book.author.toLowerCase() === author);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks); // Return books if found
  } else {
    return res.status(404).json({ message: "No books found for this author" }); // Handle case where no books are found
  }
});


// Get all books based on title
// Get book details based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title.toLowerCase(); // Retrieve title from request parameters (case insensitive)
  let booksList = Object.values(books); // Convert 'books' object to an array of book objects

  let filteredBooks = booksList.filter(book => book.title.toLowerCase() === title);

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks); // Return books if found
  } else {
    return res.status(404).json({ message: "No books found with this title" }); // Handle case where no books are found
  }
});


// Get book review by ISBN
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;  // Retrieve ISBN from request parameters
  let book = books[isbn];  // Search for the book in books database

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);  // Return reviews if they exist
  } else {
    return res.status(404).json({ message: "No reviews found for this book" });  // Handle case where no reviews exist
  }
});


module.exports.general = public_users;
