const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

    // Check for missing username or password
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username already exists
    const exists = users.find(user => user.username === username);
    if (exists) {
        return res.status(409).json({ message: "Username already exists." });
    }

    // Register the new user
    const newUser = { username, password };
    users.push(newUser);
    res.status(201).json({ message: "User registered successfully.", user: newUser });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});
module.exports = public_users;
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;  // Retrieve the ISBN from the URL parameters
    const book = books.find(b => b.isbn === isbn);  // Find the book by ISBN

    if (book) {
        res.status(200).json(book);  // Send the book details as JSON if found
    } else {
        res.status(404).json({message: "Book not found"});  // Send a 404 not found if no book matches
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = books.filter(book => book.author.toLowerCase() === author.toLowerCase());

    if (booksByAuthor.length) {
        res.status(200).json(booksByAuthor);
    } else {
        res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title.toLowerCase();
    const booksByTitle = books.filter(book => book.title.toLowerCase() === title);

    if (booksByTitle.length) {
        res.status(200).json(booksByTitle);
    } else {
        res.status(404).json({ message: "No books found with that title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books.find(book => book.isbn === isbn);

    if (book && book.reviews) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ message: "No reviews found or book does not exist for this ISBN" });
    }
});

module.exports.general = public_users;
