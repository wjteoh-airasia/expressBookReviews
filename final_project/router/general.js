const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required." });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists." });
    } else {
        users.push({ username, password });
        return res.status(201).json({ message: "User registered successfully!" });
    }
});

public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});


public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

public_users.get('/author/:author', function (req, res) {
    const authorBooks = Object.values(books).filter(book => book.author === req.params.author);
    if (authorBooks.length > 0) {
        return res.status(200).json(authorBooks);
    } else {
        return res.status(404).json({ message: "Books by this author not found." });
    }
});

public_users.get('/title/:title', function (req, res) {
    const titleBooks = Object.values(books).filter(book => book.title === req.params.title);
    if (titleBooks.length > 0) {
        return res.status(200).json(titleBooks);
    } else {
        return res.status(404).json({ message: "Books with this title not found." });
    }
});

public_users.get('/review/:isbn', function (req, res) {
    const { isbn } = req.params;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

module.exports.general = public_users;
