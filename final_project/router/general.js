const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({
            message: "Benutzer name und password sind pflicht angaben!!",
        });
    }

    const isExist = users.find((user) => user.username === username);
    if (isExist) {
        return res.status(400).json({
            message: "Diese Benutzer ist schon bereits existiert",
        });
    }
    users.push({
        username,
        password,
    });
    return res.status(201).json({
        message: "Benutzer wurde erffolgreich registriert :)",
        username: username,
    });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
    return res.status(200).json({
        message: "Die Bücher liste: ",
        books,
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
    const isbn = parseInt(req.params.isbn);
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({
            message: "Buch nicht gefunden",
        });
    }
    return res.status(201).json({
        message: "Buch Details: ",
        book: book,
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
    const autor = req.params.author.toLocaleLowerCase();
    const findAutor = Object.values(books).filter(
        (book) => book.author.toLocaleLowerCase() === autor
    );
    if (findAutor.length === 0) {
        return res.status(404).json({
            message: "Autor nicht gefunden",
        });
    }
    return res.status(200).json({
        message: `Diese autor ${autor} hat diese buch`,
        findAutor,
    });
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
    const title = req.params.title;
    const book = Object.values(books).filter(
        (b) => b.title.toLocaleLowerCase() === title.toLocaleLowerCase()
    );
    if (book.length === 0) {
        return res.status(404).json({
            message: "buch mit diesem Title nicht gefunden",
        });
    }
    return res.status(200).json({
        title: title,
        books: book,
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
    const isbn = parseInt(req.params.isbn);
    const book = books[isbn];
    if (!book) {
        return res.status(404).json({
            message: "buch nicht gefunden",
        });
    }

    const reviewKeys = Object.keys(book.reviews);
    if (reviewKeys.length === 0) {
        return res.json({
            message: "diese buch hat kein bewertung",
        });
    }
    return res.json({
        message: "Bewertung",
        reviews: book.reviews,
    });
});

module.exports.general = public_users;
