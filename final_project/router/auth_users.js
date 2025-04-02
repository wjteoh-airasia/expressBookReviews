const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];
const secretKey = "secret_key";

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    console.log(users);
    const user = users.find(user => user.username === username);
    
    if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ username }, secretKey, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful", token });
});

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("Received Token:", authHeader); // Debugging log

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract actual token from "Bearer <token>"
    
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token." });
        }
        req.username = decoded.username; // Store username from token
        console.log("Token Verified. Username:", req.username); // Debugging log
        next();
    });
};

regd_users.put("/review/:isbn",verifyToken, (req,res) => {
    const { isbn } = req.params;
    console.log(isbn);
    const { review } = req.body;
    const username = req.username;

    if (!review) {
        return res.status(400).json({ message: "Review content is required." });
    }

    const book = Object.values(books).find(book => book.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (!book.reviews) {
        book.reviews = {};
    }

    book.reviews[username] = review;

    res.status(200).json({ message: "Review added/updated successfully.", reviews: book.reviews });
    
});


regd_users.delete("/review/:isbn", verifyToken, (req, res) => {
    const { isbn } = req.params;
    console.log("Deleting review for ISBN:", isbn);
    const username = req.username;

    const book = Object.values(books).find(book => book.isbn === isbn);
    if (!book) {
        return res.status(404).json({ message: "Book not found." });
    }

    if (!book.reviews || !book.reviews[username]) {
        return res.status(404).json({ message: "No review found for this book from the user." });
    }

    // Delete the user's review
    delete book.reviews[username];

    res.status(200).json({ message: "Review deleted successfully.", reviews: book.reviews });
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
