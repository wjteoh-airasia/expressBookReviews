const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    const user = users.find(user => user.username === username);
    if (!user) return false;
    return true;
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    if (!isValid(username)) return false;
    const user = users.find(user => user.username === username);
    if (user.password !== password) return false;
    return true;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here\

    const { username, password } = req.body;

    if (!(username && password)) return res.status(400).json({ message: "Username and password required!" })

    if (!authenticatedUser(username, password)) return res.status(400).send("Username or password is incorrect!");

    const accessToken = jwt.sign({ username, password }, "secretPrivateKey", { expiresIn: 60 * 3 });
    req.session.authorization = { accessToken, username };

    return res.status(200).send("User successfully logged in!");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization["username"];
    const book = books[isbn];

    if (!book) return res.status(404).json({ message: "Book not found!" });
    book.reviews[username] = review;
    return res.status(200).json({ message: "Review added successfully!" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const username = req.session.authorization["username"];
    const book = books[isbn];

    if (!book) return res.status(404).json({ message: "Book not found!" });

    if (!book.reviews[username]) return res.status(404).json({ message: "Review not found!" });

    delete book.reviews[username];

    return res.status(200).json({ message: "Review deleted successfully!" });
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
