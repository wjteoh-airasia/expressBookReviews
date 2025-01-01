const express = require('express');
const axios = require('axios'); // Ensure axios is installed
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10: Get the list of books available in the shop
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('https://example.com/api/books'); // Replace with actual API endpoint
        const books = response.data;
        res.status(200).json(JSON.stringify(books, null, 4)); // Neatly format the output
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});

// Task 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const response = await axios.get(`https://example.com/api/book/${isbn}`); // Replace with actual API endpoint
        const bookDetails = response.data;
        if (!bookDetails) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(bookDetails);
    } catch (error) {
        res.status(500).json({ message: "Error fetching book details" });
    }
});

// Task 12: Get book details based on Author
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const response = await axios.get(`https://example.com/api/books?author=${author}`); // Replace with actual API endpoint
        const booksByAuthor = response.data;
        if (!booksByAuthor || booksByAuthor.length === 0) {
            return res.status(404).json({ message: "No books found by this author" });
        }
        res.status(200).json(booksByAuthor);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by author" });
    }
});

// Task 13: Get book details based on Title
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const response = await axios.get(`https://example.com/api/books?title=${title}`); // Replace with actual API endpoint
        const booksByTitle = response.data;
        if (!booksByTitle || booksByTitle.length === 0) {
            return res.status(404).json({ message: "No books found with this title" });
        }
        res.status(200).json(booksByTitle);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books by title" });
    }
});

module.exports.general = public_users;
