const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    //returns boolean
    return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
    //returns boolean
    return users.some(
        (user) => user.username === username && user.password === password
    );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            message: "Benutzername und Passwort sind erforderlich ",
        });
    }

    const isExist = users.find(
        (user) => user.username === username && user.password === password
    );

    if (!isExist) {
        return res.status(404).send("Ungültige Daten");
    }

    const token = jwt.sign({ username: username }, "fingerprint_customer", {
        expiresIn: "1h",
    });

    req.session.authorization = {
        accessToken: token,
        username,
    };

    return res.status(200).json({
        message: "Erfolgreich angemeldet",
        token: token,
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review;

    if (!review) {
        return res.status(400).json({
            message: "Rezension ist erforderlich",
        });
    }

    const username = req.session.authorization.username;
    if (!username) {
        return res.status(401).json({
            message: "Nicht autorisiert",
        });
    }

    const book = books[isbn];
    if (!book) {
        return res.status(404).json({
            message: "Buch nicht gefunden",
        });
    }

    book.reviews[username] = review;

    return res.status(200).json({
        message: "Rezenzion gespeichert",
        reviews: book.reviews,
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = parseInt(req.params.isbn);
    const username = req.session.authorization?.username;

    if (!username) {
        return res.status(401).json({
            message: "Nicht autorisiert. Bitte einloggen",
        });
    }
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({
            message: "buch nicht gefunden",
        });
    }

    if (!book.reviews[isbn]) {
        return res.status(404).json({
            message: "Keine Bewertung von diesem Benutzer gefunden",
        });
    }

    delete book.reviews[username];

    return res.status(200).json({
        message: "Bwertung erfolgreich gelöscht",
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
