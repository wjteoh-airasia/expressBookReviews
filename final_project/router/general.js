const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }
  
    if (isValid && !isValid(username, password)) {
      return res.status(400).json({ error: "Invalid username or password" });
    }
  
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }
  
    const newUser = { username, password }; 
  
    users.push(newUser);
  

    return res.status(201).json({ message: "Registration successful" });
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    const availableBooks = books.filter(book => book.available === true);
    const formattedBooks = availableBooks.map(book => ({
        title: book.title,
        author: book.author,
        ISBN: book.ISBN,
        price: book.price
    }));
    return res.status(200).json({ books: JSON.stringify(formattedBooks, null, 2) });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const requestedISBN = req.params.isbn;
    const bookDetails = books.find(book => book.ISBN === requestedISBN);
    
    if (!bookDetails) {
        return res.status(404).json({ error: 'Book not found' });
    }

    return res.status(200).json({ book: JSON.stringify(bookDetails, null, 2) });
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const requestedAuthor = req.params.author;
    const booksByAuthor = books.filter(book => book.author.toLowerCase() === requestedAuthor.toLowerCase());
    
    if (booksByAuthor.length === 0) {
        return res.status(404).json({ error: 'Author not found' });
    }

    const formattedBooks = booksByAuthor.map(book => ({
        title: book.title,
        ISBN: book.ISBN,
        price: book.price
    }));

    return res.status(200).json({ books: JSON.stringify(formattedBooks, null, 2) });
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const requestedTitle = req.params.title;
    const bookDetails = books.find(book => book.title.toLowerCase() === requestedTitle.toLowerCase());
    
    if (!bookDetails) {
        return res.status(404).json({ error: 'Book not found' });
    }
    
    return res.status(200).json({ book: JSON.stringify(bookDetails, null, 2) });
    });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const requestedISBN = req.params.isbn;
    const book = books.find(book => book.ISBN === requestedISBN);
    
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    
    if (!book.reviews) {
        return res.status(404).json({ error: 'No reviews found for this book' });
    }
    
    return res.status(200).json({ reviews: JSON.stringify(book.reviews, null, 2) });
    });

module.exports.general = public_users;
