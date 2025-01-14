const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body; // Get username and password from request body

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists." });
    }

    // Add the new user to the users array
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." }); // Respond with success message
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params; // Retrieve the ISBN from request parameters
    const bookDetails = Object.values(books).find(book => book.isbn === isbn); // Search for the book

    if (bookDetails) {
        return res.status(200).json(bookDetails); // Return book details if found
    } else {
        return res.status(404).json({ message: "Book not found" }); // Return 404 if not found
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const { author } = req.params; // Retrieve the author from request parameters
    const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase()); // Filter books by author

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks); // Return matching books if found
    } else {
        return res.status(404).json({ message: "No books found by this author" }); // Return 404 if no books found
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const { title } = req.params; // Retrieve the title from request parameters
    const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase()); // Filter books by title

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks); // Return matching books if found
    } else {
        return res.status(404).json({ message: "No books found with this title" }); // Return 404 if no books found
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const { isbn } = req.params; // Retrieve the ISBN from request parameters
    const book = Object.values(books).find(book => book.isbn === isbn); // Find the book by ISBN

    if (book) {
        return res.status(200).json(book.reviews); // Return the reviews if the book is found
    } else {
        return res.status(404).json({ message: "Book not found" }); // Return 404 if no book found
    }
});

module.exports.general = public_users;
