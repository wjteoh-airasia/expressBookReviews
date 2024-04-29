const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Check if the username already exists
    if (users.find(user => user.username === username)) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    // Register the new user
    users.push({ username, password });

    return res.status(201).json({ message: 'Usuario registrado con éxito. Ahora ya puedes loguearte' });
});



// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn])
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = [];

    // Iterate through all books to find matches
    Object.keys(books).forEach(function (key) {
        const book = books[key];
        if (book.author === author) {
            matchingBooks.push(book);
        }
    });

    // Send response with matching books
    if (matchingBooks.length > 0) {
        res.status(200).json(matchingBooks);
    } else {
        res.status(404).send('No books found for the author.');
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const matchingBooks = [];

    // Iterate through all books to find matches
    Object.keys(books).forEach(function (key) {
        const book = books[key];
        if (book.title === title) {
            matchingBooks.push(book);
        }
    });

    // Send response with matching books
    if (matchingBooks.length > 0) {
        res.status(200).json(matchingBooks);
    } else {
        res.status(404).send('No books found with the title provided.');
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
