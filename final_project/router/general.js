const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");
const { parse } = require("dotenv");
const BASE_URL = "http://localhost:5000/";

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

// Klassische direkte Route (nicht für Aufgabe 10!)
// public_users.get("/", (req, res) => {
//     return res.status(200).json({
//         message: "Direkte Bücherliste:",
//         books,
//     });
// });

// Aufgabe 10 – mit Axios und async/await
public_users.get("/", async (req, res) => {
    try {
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: books });
            }, 100);
        });

        return res.status(200).json({
            message: "Bücherliste (von Axios geladen):",
            books: response.data,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Fehler beim Laden.",
            error: error.message,
        });
    }
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//     const isbn = parseInt(req.params.isbn);
//     const book = books[isbn];
//     if (!book) {
//         return res.status(404).json({
//             message: "Buch nicht gefunden",
//         });
//     }
//     return res.status(201).json({
//         message: "Buch Details: ",
//         book: book,
//     });
// });

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async (req, res) => {
    try {
        const isbn = parseInt(req.params.isbn);
        if (isNaN(isbn)) {
            return res.status(400).json({
                message: "Geben Sie ISBN nummer ein",
            });
        }

        const response = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve({
                    data: books[isbn],
                });
            }, 100);
        });

        return res.status(200).json({
            message: "Buch mit diesem ISBN",
            book: response.data,
        });
    } catch (err) {
        return res.status(400).json({
            message: "Fehler beim aufrufen der Buch mit ISBN",
            error: err.message,
        });
    }
});

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//     const autor = req.params.author.toLocaleLowerCase();
//     const findAutor = Object.values(books).filter(
//         (book) => book.author.toLocaleLowerCase() === autor
//     );
//     if (findAutor.length === 0) {
//         return res.status(404).json({
//             message: "Autor nicht gefunden",
//         });
//     }
//     return res.status(200).json({
//         message: `Diese autor ${autor} hat diese buch`,
//         findAutor,
//     });
// });

// Get book details based on author
public_users.get("/author/:author", async (req, res) => {
    try {
        const autor = req.params.author.toLowerCase();
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: books });
            }, 100);
        });
        const buchlist = response.data;

        const result = Object.values(buchlist).filter(
            (book) => book.author.toLowerCase() === autor
        );

        if (result.length === 0) {
            return res.status(404).json({
                message: "Kein daten für diese Benutzer",
            });
        }

        return res.status(200).json({
            message: "bucher daten autor",
            books: result,
        });
    } catch (err) {
        return res.json({
            message: "Fehler beim Laden der Bücher!!",
            error: err.message,
        });
    }
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//     const title = req.params.title;
//     const book = Object.values(books).filter(
//         (b) => b.title.toLocaleLowerCase() === title.toLocaleLowerCase()
//     );
//     if (book.length === 0) {
//         return res.status(404).json({
//             message: "buch mit diesem Title nicht gefunden",
//         });
//     }
//     return res.status(200).json({
//         title: title,
//         books: book,
//     });
// });

public_users.get("/title/:title", async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();
        const response = await new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: books });
            }, 100);
        });
        const bookList = Object.values(response.data);
        const book = bookList.filter((b) => b.title.toLowerCase() === title);
        if (book.length === 0) {
            return res.status(404).json({
                message: "nicht gefunden",
            });
        }

        return res.status(200).json({
            message: "Bücher",
            books: book,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Fehler beim buch details laden",
            error: error.message,
        });
    }
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
