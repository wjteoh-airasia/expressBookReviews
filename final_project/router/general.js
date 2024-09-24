const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    let userswithsamename = users.some((user) => {
        user.username === username;
    });

    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    console.log(username + password)

    if(!username || !password) {
        return res.status(400).json({ message: "Invalid input! Username and password must be entered." });
    }

    if (doesExist(username)) {
        return res.status(400).json({ message: "Username already exists!" });
    }

    users.push({ "username": username, "password": password });
    return res.status(200).json({ message: "User Successfully Registered. Now you can login." });

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;
    return res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let authorName = req.params.author;
    let booksByAuthor = [];

    Object.keys(books).forEach(key => {
        if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
            booksByAuthor.push(books[key]);
        }
    });

    if (booksByAuthor.length > 0) {
        return res.status(200).json({ books: booksByAuthor })
    }
    return res.status(404).json({ message: "No books found for the author: " + authorName });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let bookTitle = req.params.title;
    let booksByTitle = [];

    Object.keys(books).forEach(key => {
        if (books[key].title.toLowerCase() === bookTitle.toLowerCase()) {
            booksByTitle.push(books[key]);
        }
    });

    if (booksByTitle.length > 0) {
        return res.status(200).json({ books: booksByTitle });
    }
    return res.status(404).json({ message: "No books found for the title: " + bookTitle });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;

    if (books[isbn] && books[isbn].reviews.length > 0) {
        return res.status(200).json({ reviews: books[isbn].reviews })
    }
    return res.status(404).json({ message: "No book reviews found for the book" });
});

module.exports.general = public_users;
