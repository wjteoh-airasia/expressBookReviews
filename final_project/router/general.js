const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('URL_TO_YOUR_BOOKS_ENDPOINT');
        res.status(200).json({ books: response.data });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books", error: error.message });
    }
});
// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`URL_TO_YOUR_BOOKS_ENDPOINT/${isbn}`);
        res.status(200).json(response.data);
    } catch (error) {
        res.status(404).json({ message: "Book not found", error: error.message });
    }
});


// Task 3: Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author.toLowerCase();
    try {
        const response = await axios.get('URL_TO_YOUR_BOOKS_ENDPOINT');
        const booksByAuthor = response.data.filter(book => book.author.toLowerCase() === author);

        if (booksByAuthor.length > 0) {
            res.status(200).json({ books: booksByAuthor });
        } else {
            res.status(404).json({ message: "No books found by this author" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by author", error: error.message });
    }
});


// Task 4: Get book details based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title.toLowerCase();
    try {
        const response = await axios.get('URL_TO_YOUR_BOOKS_ENDPOINT');
        const booksByTitle = response.data.filter(book => book.title.toLowerCase() === title);

        if (booksByTitle.length > 0) {
            res.status(200).json({ books: booksByTitle });
        } else {
            res.status(404).json({ message: "No books found with this title" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books by title", error: error.message });
    }
});


// Task 5: Get book reviews based on ISBN
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json({ reviews: book.reviews });
    } else {
        return res.status(404).json({ message: "Reviews not found" });
    }
});

// Task 6: Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users[username]) {
        return res.status(409).json({ message: "Username already exists" });
    }

    users[username] = { username, password }; // In a real application, ensure secure storage
    return res.status(201).json({ message: "User registered successfully" });
});

module.exports.general = public_users;
