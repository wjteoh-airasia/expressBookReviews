const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



// Route to handle user registration
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});


public_users.get('/', function (req, res) {
  // Create a Promise that resolves with the books object
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("No books found");
    }
  });

  // Handle the Promise
  getBooks
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  // Wrap book lookup in a Promise
  const getBookByISBN = new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  });

  // Handle the Promise
  getBookByISBN
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;

  const getBooksByAuthor = new Promise((resolve, reject) => {
    const author_books = Object.values(books).filter(book => book.author === author);

    if (author_books.length > 0) {
      resolve(author_books);
    } else {
      reject("No books found for this author");
    }
  });

  getBooksByAuthor
    .then((books) => {
      res.status(200).json({ books });
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  const getBooksByTitle = new Promise((resolve, reject) => {
    const booksByTitle = Object.values(books).filter(book => book.title === title);

    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject("No book found with this title");
    }
  });

  getBooksByTitle
    .then((books) => {
      res.status(200).json({ books });
    })
    .catch((err) => {
      res.status(404).json({ message: err });
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  
    if (book) {
      return res.status(200).json({ review: book.reviews });
    } else {
      return res.status(404).json({ message: "No book" });
    }
});


module.exports.general = public_users;
