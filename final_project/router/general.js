const express = require("express");
let books = require("./booksdb.js");
const { parse } = require("dotenv");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send(`Benutzer name und passwort sind erforderlich`);
    }

    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
        return res.send(`Diese Benutzer ${username} exister schon bereit`);
    }
    users.push({ username, password });
    return res.status(201).json({
        message: `Benutzer ${username} wurde erfolgreich registriert`,
    });
});

public_users.get("/users", (req, res) => {
    res.json(users);
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const ISBN = parseInt(req.params.isbn);
    const findeISBN = books[ISBN];
    if (!findeISBN) {
        return res.status(404).send("Book not found");
    }
    return res.status(200).json(findeISBN);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const author = req.params.author.toLocaleLowerCase();
    const book = Object.values(books).find(
        (b) => b.author.toLocaleLowerCase() === author
    );
    if (!book) {
        return res
            .status(404)
            .send("Es gibt kein bücher für diese Author bei uns !!! ");
    }
    return res.status(200).json(book);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title.toLocaleLowerCase();
    const book = Object.values(books).find(
        (t) => t.title.toLocaleLowerCase() === title
    );
    if (!book) {
        return res.status(404).send("Buch mit diesem Title gibt es nicht ");
    }
    return res.status(200).json(book);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = parseInt(req.params.isbn);
    const book = books[isbn];
    if (!book) {
        return res.send("Buch nicht gefunden");
    }
    return res.status(200).send(book.reviews);
});

module.exports.general = public_users;
