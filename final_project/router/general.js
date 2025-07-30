const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', function (req, res) {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).send({ message: "Username and password are required" });
  }

  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(400).send({ message: "Username already exists" });
  }

  // Add new user
  users.push({ username, password });
  return res.status(200).send({ message: "User successfully registered" });
});


// Get the book list available in the shop

// Route to get list of all books
public_users.get('/', function (req, res) {
    return res.status(200).json({
        message: "List of available books",
        books: books
    });
});

public_users.get('/books-promise', (req, res) => {
  axios.get('http://localhost:52887/') // Adjust port if different
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(error => {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    });
});

// ✅ Task 10 - Using async/await
public_users.get('/books-async', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:52887/');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

module.exports = public_users;

// Get book details based on ISBN
// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;   // Get ISBN from the URL

  // Check if the book exists in the books object
  if (books[isbn]) {
      return res.status(200).json({
          message: `Book details for ISBN: ${isbn}`,
          book: books[isbn]
      });
  } else {
      return res.status(404).json({
          message: "Book not found for the provided ISBN"
      });
  }
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();  // Convert to lowercase for case-insensitive match
  const allBooks = Object.keys(books);             // Get all ISBN keys
  let booksByAuthor = [];

  // Loop through all books
  allBooks.forEach(isbn => {
      if (books[isbn].author.toLowerCase() === author) {
          booksByAuthor.push({
              isbn: isbn,
              title: books[isbn].title,
              author: books[isbn].author,
              reviews: books[isbn].reviews
          });
      }
  });

  // Respond with results
  if (booksByAuthor.length > 0) {
      return res.status(200).json({
          message: `Books by author: ${req.params.author}`,
          books: booksByAuthor
      });
  } else {
      return res.status(404).json({
          message: `No books found by author: ${req.params.author}`
      });
  }
});


public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;
  let matchingBooks = [];

  // Loop through all books
  for (let key in books) {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      matchingBooks.push(books[key]);
    }
  }

  if (matchingBooks.length > 0) {
    res.send(matchingBooks);
  } else {
    res.status(404).send({ message: "No book found with the given title" });
  }
});


public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;

  // Check if book exists
  if (books[isbn]) {
    let reviews = books[isbn].reviews;
    
    // Check if reviews are empty
    if (Object.keys(reviews).length === 0) {
      res.send({ message: "No reviews available for this book" });
    } else {
      res.send(reviews);
    }
  } else {
    res.status(404).send({ message: "Book not found for the given ISBN" });
  }
});



module.exports.general = public_users;
