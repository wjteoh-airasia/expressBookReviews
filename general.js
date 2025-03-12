// general.js
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const jwt = require('jsonwebtoken');
const public_users = express.Router();

// TASK 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// TASK 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];

    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// TASK 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
    let author = req.params.author;
    let bookList = Object.values(books).filter(book => book.author === author);

    if (bookList.length > 0) {
        return res.status(200).json(bookList);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// TASK 4: Get book details based on title
public_users.get('/title/:title', function (req, res) {
    let title = req.params.title;
    let bookList = Object.values(books).filter(book => book.title === title);

    if (bookList.length > 0) {
        return res.status(200).json(bookList);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

// TASK 5: Get book review by ISBN
public_users.get('/review/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    let book = books[isbn];

    if (book && book.reviews) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "No reviews found for this book" });
    }
});

// TASK 7: Login as a registered user
public_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username exists and password matches
    let user = users[username];

    if (user && user.password === password) {
        const token = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' });
        req.session.token = token;
        return res.status(200).json({ message: "Login successful", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Task 8: Add or Modify a Book Review
public_users.post('/review/:isbn', (req, res) => {
    let isbn = req.params.isbn;
    let review = req.query.review;  // Get the review from the query
    let username = req.body.username; // Username from session (you can use JWT or session to get the username)
  
    // Check if the user is authenticated
    if (!username) {
      return res.status(403).json({ message: "Unauthorized: Please login first" });
    }
  
    // Check if a review was provided in the query
    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }
  
    let book = books[isbn];
  
    if (book) {
      // If the review for the book already exists for this user, modify it
      // If it's a new review for the book, add it
      book.reviews[username] = review;
  
      return res.status(200).json({ message: `Review added/updated for book ISBN: ${isbn}` });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });
  

// TASK 9: Delete a book review by ISBN (User can delete only their own reviews)
public_users.delete('/auth/review/:isbn', (req, res) => {
    let isbn = req.params.isbn;
    let username = req.body.username; // Username from session

    if (!username) {
        return res.status(403).json({ message: "Unauthorized: Please login first" });
    }

    let book = books[isbn];
  
    if (book && book.reviews[username]) {
        // Delete the review for the current user
        delete book.reviews[username];
        return res.status(200).json({ message: `Review for book ISBN: ${isbn} deleted successfully` });
    } else {
        return res.status(404).json({ message: "Review not found" });
    }
});

// TASK 10: Get the book list using Promise callbacks or async-await with Axios
public_users.get('/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/'); // Fetch books from the server
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// TASK 11: Get book details based on ISBN using Promise callbacks or async-await with Axios
public_users.get('/books/isbn/:isbn', async (req, res) => {
    let isbn = req.params.isbn;
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Book not found" });
    }
});

// TASK 12: Get book details based on Author using Promise callbacks or async-await with Axios
public_users.get('/books/author/:author', async (req, res) => {
    let author = req.params.author;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// TASK 13: Get book details based on Title using Promise callbacks or async-await with Axios
public_users.get('/books/title/:title', async (req, res) => {
    let title = req.params.title;
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "No books found with this title" });
    }
});


module.exports.general = public_users;
