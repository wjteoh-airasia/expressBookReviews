const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ 'username': username, 'password': password });
      return res.status(200).json({ message: `${username} successfully registered. Now you can login  ` });
    } else {
      return res.status(404).json({ message: `${username} already exists!` });
    };
  };
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop

public_users.get('/', function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, '\n'));

});

// Get book details based on ISBN

public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const book_isbn = req.params.isbn;
  res.send(books[book_isbn]);
});

// Get book details based on author

public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const book_author = req.params.author;
  const bookArr = Object.values(books);
  const book_details = bookArr.filter((book) => book.author == book_author).map((book) => book);
  res.send(book_details);
});

// Get all books based on title

public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const book_title = req.params.title;
  const bookArr = Object.values(books);
  const book_details = bookArr.filter((book) => book.title == book_title).map((book) => book);
  res.send(book_details);
});

//  Get book review

public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  const book_rev = book.reviews;
  res.send(book_rev)
});

module.exports.general = public_users;
