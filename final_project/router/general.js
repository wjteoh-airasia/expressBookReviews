const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  // Simulated user authentication (replace with actual logic)
  
  if (isValid(username)) {
    res.status(400).json({ message: 'User already exists'});
  }
  if (username?.length > 0 && password?.length > 0) {
    const newUser = { username, password };
    req.session.user = username;

    users.push(newUser);
    res.send('Logged in successfully');
  } else {
    res.send('Invalid credentials');
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject('No books available');
    }
  });

  getBooks.then((books) => {
    res.status(200).json(books);
  }).catch((err) => {
    res.status(204).json({message: err});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const findBook = new Promise((resolve, reject) => {
    const { isbn } = req.params;
    const foundBook = books[isbn];

    if (foundBook) {
      resolve(foundBook);
    } else {
      reject('Book is not found');
    }
  });

  findBook.then((book) => {
    res.status(200).json(book);
  }).catch((err) => {
    res.status(204).json({message: err});
  });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const findBook = new Promise((resolve, reject) => {
    const { author } = req.params;
    const foundBooks = Object.values(books).filter(book => book.author === author);

    if (foundBooks) {
      resolve(foundBooks);
    } else {
      reject('Book is not found');
    }
  });

  findBook.then((books) => {
    res.status(200).json(books);
  }).catch((err) => {
    res.status(204).json({message: err});
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const getBooks = new Promise((resolve, reject) => {
    const { title } = req.params;
    const foundBooks = Object.values(books).filter(book => book.title === title);

    if (foundBooks) {
      resolve(foundBooks);
    } else {
      reject('Book is not found');
    }
  });

  getBooks.then((books) => {
    res.status(200).json(books);
  }
  ).catch((err) => {
    res.status(204).json({message: err});
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params;
  const foundBook = books[isbn];
  const reviews = foundBook.reviews;

  if (!foundBook) {
    return res.status(204).json({message: "Book is not found"});
  }

  return res.status(200).json(reviews);
});

module.exports.general = public_users;
