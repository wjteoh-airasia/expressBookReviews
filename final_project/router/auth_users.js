const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username; // Assuming the username is stored in the session

    // Check if review is provided in the request query
    if (!review) {
        return res.status(400).json({ message: 'Review is required' });
    }

    // Check if the book exists in the database
    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the user has already reviewed the book
    if (books[isbn].reviews[username]) {
        // If the user has already reviewed the book, modify the existing review
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: 'Review modified successfully' });
    } else {
        // If the user has not reviewed the book, add a new review
        books[isbn].reviews[username] = review;
        return res.status(201).json({ message: 'Review added successfully' });
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // Assuming the username is stored in the session

    // Check if the book exists in the database
    if (!books[isbn]) {
        return res.status(404).json({ message: 'Book not found' });
    }

    // Check if the user has reviewed the book
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: 'Review not found' });
    }

    // Delete the review associated with the user
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: 'Review deleted successfully' });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
