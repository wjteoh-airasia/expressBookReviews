const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body; // Get username and password from the request body

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    if (users[username]) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Register the user
    users[username] = { password }; // Save user data
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const bookList = JSON.stringify(books, null, 2); // Format the books data neatly
    return res.status(200).send(bookList); // Send the formatted book list as the response
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params; // Retrieve the ISBN from the request parameters
    const book = books[isbn]; // Look up the book by its ISBN

    if (book) {
        return res.status(200).json(book); // Return the book details as JSON
    } else {
        return res.status(404).json({ message: "Book not found" }); // Return an error if the book doesn't exist
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const { author } = req.params; // Get the author from the request parameters
    const filteredBooks = Object.values(books).filter(book => book.author === author); // Filter books by author

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks); // Return books written by the author
    } else {
        return res.status(404).json({ message: "No books found by this author" }); // No match
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const { title } = req.params; // Get the title from the request parameters
    const filteredBooks = Object.values(books).filter(book => book.title === title); // Filter books by title

    if (filteredBooks.length > 0) {
        return res.status(200).json(filteredBooks); // Return books matching the title
    } else {
        return res.status(404).json({ message: "No books found with this title" }); // No match
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params; // Get the ISBN from the request parameters
    const book = books[isbn]; // Find the book by ISBN

    if (book && book.reviews) {
        return res.status(200).json(book.reviews); // Return the reviews
    } else {
        return res.status(404).json({ message: "Reviews not found for this book" }); // No reviews
    }
});

module.exports.general = public_users;
