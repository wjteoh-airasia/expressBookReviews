const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the username already exists
  if (users.find(user => user.username === username)) {
      return res.status(409).json({ message: 'Username already exists' });
  }

  // Register the new user
  users.push({ username, password });

  return res.status(201).json({ message: 'User registered successfully' });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
 // Convert the books object to a JSON string with indentation for neat display
 const jsonBooks = JSON.stringify(Object.values(books), null, 2);
    
 // Set the response content type to JSON
 res.set('Content-Type', 'application/json');
 
 // Send the JSON string as the response
 res.status(200).send(jsonBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function(req, res) {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
    
    // Check if a book with the given ISBN exists
    if (books[isbn]) {
        // Book found, send its details as a response
        const bookDetails = books[isbn];
        res.status(200).json(bookDetails);
    } else {
        // Book not found, send a 404 Not Found response
        res.status(404).json({ message: 'Book not found' });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function(req, res) {
  // Retrieve the author from the request parameters
  const author = req.params.author;
  
  // Array to store books by the author
  const booksByAuthor = [];
  
  // Iterate through the books object and find books by the author
  Object.values(books).forEach(book => {
      if (book.author.toLowerCase() === author) {
          booksByAuthor.push(book);
      }
  });
  
  // Check if any books were found for the author
  if (booksByAuthor.length > 0) {
      // Books found, send their details as a response
      res.status(200).json(booksByAuthor);
  } else {
      // No books found for the author, send a 404 Not Found response
      res.status(404).json({ message: 'No books found for the author' });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;  
  const booksByTitle = [];  
  Object.values(books).forEach(book => {
    const bookTitle = book.title.toLowerCase().replace(/\s/g, '');
      if (bookTitle === title) {
          booksByTitle.push(book);
      }
  });
  
  // Check if any books were found for the title
  if (booksByTitle.length > 0) {
      // Books found, send their details as a response
      res.status(200).json(booksByTitle);
  } else {
      // No books found for the title, send a 404 Not Found response
      res.status(404).json({ message: 'No books found for the title' });
  }
});

//  Get book review
public_users.get('/review/:isbn', function(req, res) {
  const isbn = req.params.isbn;
  
  // Check if the book exists in the database
  if (books[isbn]) {
      const bookReviews = books[isbn].reviews;
      
      // Check if the book has any reviews
      if (Object.keys(bookReviews).length > 0) {
          // Book reviews found, send them as a response
          res.status(200).json(bookReviews);
      } else {
          // No reviews found for the book, send a 404 Not Found response
          res.status(404).json({ message: 'No reviews found for the book' });
      }
  } else {
      // Book not found, send a 404 Not Found response
      res.status(404).json({ message: 'Book not found' });
  }
});


module.exports.general = public_users;
