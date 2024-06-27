const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {

    const { username, password } = req.body;

    if (!(username && password)) return res.status(400).send("Username and password required");

    if (isValid(username)) return res.status(400).send("Username already exists");
    users.push({ username, password });

    return res.status(200).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
        const fetchedBooks = await (async () => books)()
        return res.status(200).send(JSON.stringify(fetchedBooks, null, 4))
    } catch (error) {
        console.log(error);
        // It's a good practice to return a server error status when the request fails
        return res.status(500).send("Failed to fetch books: " + error);
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = await (async () => books[isbn])();
        if (!book) return res.status(404).json({ message: "Book not found!" });
        return res.status(200).send(JSON.stringify(book, null, 4));
    } catch (error) {
        console.log(error);
        return res.status(500).send("Failed to fetch book: " + error);
    }

});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const booksByAuthor = await (async () => Object.values(books).filter(book => book.author === author))();

        if (!booksByAuthor?.length) return res.status(404).json({ message: "Books not found!" });

        return res.status(200).send(JSON.stringify(booksByAuthor, null, 4));
    } catch (error) {
        console.log(error);
        return res.status(500).send("Failed to fetch books: " + error);
    }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const booksByTitle = await (async () => Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase())))();
        if (!booksByTitle?.length) return res.status(404).json({ message: "Books not found!" });
        return res.status(200).send(JSON.stringify(booksByTitle, null, 4));
    } catch (error) {
        console.log(error)
        return res.status(500).send("Failed to fetch book: " + error);
    }
});


//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
    try {
        const isbn = req.params.isbn;
        const book = await (async () => books[isbn])();
        if (!book) return res.status(404).json({ message: "Book not found!" });
        return res.status(200).send(JSON.stringify(book.reviews, null, 4));
    } catch (error) {
        console.log(error)
        return res.status(500).send("Failed to fetch book: " + error);
    }
});

module.exports.general = public_users;
