// auth_users.js
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {};  // Store users as an object, not an array

const isValid = (username) => { 
    return users.hasOwnProperty(username);  // returns boolean to check if username exists
};

const authenticatedUser = (username, password) => { 
    // Check if username and password match the one we have in records.
    return users[username] && users[username].password === password;
};

// only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' });
        req.session.token = token;
        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Register a new user
regd_users.post("/register", (req, res) => {
    let { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (users[username]) {  // Check if the username exists
        return res.status(409).json({ message: "Username already exists" });
    }

    users[username] = { password };
    return res.status(201).json({ message: "User registered successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
