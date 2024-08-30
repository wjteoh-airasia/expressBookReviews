const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
}

// Middleware to authenticate the token and set req.user
function authenticateToken(req, res, next) {
    const token = req.session.token; // Or get it from the Authorization header: req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ message: "Token is missing." });

    jwt.verify(token, "secretKey", (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token." });
        req.user = user; // Set the decoded user information to req.user
        next();
    });
}

// Login route
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required." });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "secretKey", { expiresIn: '1h' });
        req.session.token = token;
        return res.status(200).json({ message: "Login successful!", token });
    } else {
        return res.status(401).json({ message: "Invalid login credentials." });
    }
});

// Add or update a book review
regd_users.put("/auth/review/:isbn", authenticateToken, (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const username = req.user.username; // Get username from the decoded token

    if (books[isbn]) {
        books[isbn].reviews[username] = review;
        return res.status(200).json({ message: "Review added successfully!" });
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username; // Get username from the decoded token

    if (books[isbn]) {
        let reviews = books[isbn].reviews;

        if (reviews[username]) {
            delete reviews[username];
            return res.status(200).json({ message: `Review for book with ISBN ${isbn} deleted.` });
        } else {
            return res.status(404).json({ message: `Review not found for the user ${username}.` });
        }
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
