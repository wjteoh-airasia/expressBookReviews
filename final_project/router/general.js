const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    users.push({ username, password });  
    res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("No books found");
        }
    })
    .then((bookList) => res.status(200).json(bookList))
    .catch((error) => res.status(500).json({ message: error }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        const book = Object.values(books).find(book => book.isbn === isbn);
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    })
    .then((bookDetails) => res.status(200).json(bookDetails))
    .catch((error) => res.status(404).json({ message: error }));
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    new Promise((resolve, reject) => {
        const filteredBooks = Object.values(books).filter(book => book.author === author);
        if (filteredBooks.length > 0) {
            resolve(filteredBooks);
        } else {
            reject("No books found by this author");
        }
    })
    .then((booksList) => res.status(200).json(booksList))
    .catch((error) => res.status(404).json({ message: error }));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;

    new Promise((resolve, reject) => {
        const book = Object.values(books).find(book => book.title === title);
        if (book) {
            resolve(book);
        } else {
            reject("Book not found with this title");
        }
    })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ message: error }));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;

    new Promise((resolve, reject) => {
        const book = Object.values(books).find(book => book.isbn === isbn);
        if (book) {
            resolve(book.reviews);
        } else {
            reject("No reviews found for this book");
        }
    })
    .then((reviews) => res.status(200).json(reviews))
    .catch((error) => res.status(404).json({ message: error }));
});

module.exports.general = public_users;
