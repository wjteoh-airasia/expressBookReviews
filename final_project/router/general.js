const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const user = req.body.username
    const passwd = req.body.password
    if (isValid(user) && passwd) {
        users.push(user)
        return res.status(201).json({
            user: user,
            message: "User registered"
        });
    } else {
        return res.status(400).json({
            message: "Enter valid username and password"
        });
    }
});

const asyncBooks = new Promise((res, rej) => {
    setTimeout(() => res(books), 3000)
})
// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    asyncBooks.then((allBooks) => {
        return res.status(200).json({
            allBooks,
            message: "All available books fetched"
        });
    }).catch((err => {
        return res.status(400).json({
            message: "Failed to fetch books"
        });
    }))

});

// Get book details based on ISBN using promisse callback
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    asyncBooks.then((allBooks) => {
        const isbn = req.params.isbn
        if (isbn in allBooks) {
            const book = allBooks[isbn]
            return res.status(200).json({
                book: book,
                message: "Book available"
            });
        } else {
            return res.status(404).json({
                message: "Book not available"
            });
        }
    })
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author
    asyncBooks.then((allBooks) => {
        for (const isbn in allBooks) {
            if (books[isbn].author === author) {
                const book = allBooks[isbn]
                return res.status(200).json({
                    book: book,
                    message: "Book available"
                });
            }
        }
        return res.status(404).json({
            message: "Book not available"
        });
    })
});

// Get all books based on title using promise
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const title = req.params.title
    asyncBooks.then((allBooks) => {
    for (const isbn in allBooks) {
        if (books[isbn].title === title) {
            const book = allBooks[isbn]
            return res.status(200).json({
                book: book,
                message: "Book available"
            });
        }
    }
    return res.status(404).json({
        message: "Book not available"
    });
})
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn
    if (isbn in books) {
        const book = books[isbn]
        return res.status(200).json({
            review: book.reviews,
            message: "Book review available"
        });
    }
    return res.status(404).json({
        message: "Book not available"
    });
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
