const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const { error } = require('selenium-webdriver');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password } = req.body;

  if(!username || !password){
    return res.status(400).json({message: "Username and password are required."});
  }
  const userExist = users.some(user => user.username === username );
  if (userExist){
    return res.status(400).json({message: "Username already exists"});
  }
  users.push({username, password});
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Using async/await pattern with a Promise to simulate an async operation
    const getBooks = () => {
      return new Promise((resolve) => {
        // Simulate a small delay to demonstrate async/await
        setTimeout(() => {
          resolve(books);
        }, 100);
      });
    };

    const booksData = await getBooks();
    
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(booksData);
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ 
      message: 'Error retrieving book list',
      error: error.message 
    });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    
    // Using async/await pattern with a Promise to simulate an async operation
    const getBookByIsbn = () => {
      return new Promise((resolve, reject) => {
        // Simulate a small delay to demonstrate async/await
        setTimeout(() => {
          const book = books[isbn];
          if (book) {
            resolve(book);
          } else {
            reject(new Error('Book not found'));
          }
        }, 100);
      });
    };

    const book = await getBookByIsbn();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book by ISBN:", error);
    if (error.message === 'Book not found') {
      return res.status(404).json({ message: "Book not found" });
    }
    return res.status(500).json({ 
      message: "Error fetching book details",
      error: error.message 
    });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const authorParam = req.params.author.toLowerCase();
    
    // Using async/await pattern with a Promise to simulate an async operation
    const getBooksByAuthor = () => {
      return new Promise((resolve, reject) => {
        // Simulate a small delay to demonstrate async/await
        setTimeout(() => {
          try {
            const bookKeys = Object.keys(books);
            const booksByAuthor = [];

            for (const id of bookKeys) {
              const book = books[id];
              if (book.author.toLowerCase().includes(authorParam)) {
                booksByAuthor.push({
                  id: id,
                  title: book.title,
                  author: book.author,
                  reviews: book.reviews
                });
              }
            }


            if (booksByAuthor.length === 0) {
              const error = new Error('No books found for the specified author');
              error.code = 'NOT_FOUND';
              throw error;
            }


            resolve(booksByAuthor);
          } catch (error) {
            reject(error);
          }
        }, 100);
      });
    };

    const booksByAuthor = await getBooksByAuthor();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    console.error('Error fetching books by author:', error);
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ 
        message: 'No books found for the specified author',
        author: req.params.author
      });
    }
    return res.status(500).json({ 
      message: 'Error fetching books by author',
      error: error.message 
    });
  }
});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try {
    const titleParam = req.params.title.toLowerCase();
    
    // Using async/await pattern with a Promise to simulate an async operation
    const getBooksByTitle = () => {
      return new Promise((resolve, reject) => {
        // Simulate a small delay to demonstrate async/await
        setTimeout(() => {
          try {
            const bookKeys = Object.keys(books);
            const booksByTitle = [];

            for (const id of bookKeys) {
              const book = books[id];
              if (book.title.toLowerCase().includes(titleParam)) {
                booksByTitle.push({
                  id: id,
                  title: book.title,
                  author: book.author,
                  reviews: book.reviews
                });
              }
            }


            if (booksByTitle.length === 0) {
              const error = new Error('No books found with the specified title');
              error.code = 'NOT_FOUND';
              throw error;
            }


            resolve(booksByTitle);
          } catch (error) {
            reject(error);
          }
        }, 100);
      });
    };

    const booksByTitle = await getBooksByTitle();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(booksByTitle);
  } catch (error) {
    console.error('Error fetching books by title:', error);
    if (error.code === 'NOT_FOUND') {
      return res.status(404).json({ 
        message: 'No books found with the specified title',
        title: req.params.title
      });
    }
    return res.status(500).json({ 
      message: 'Error fetching books by title',
      error: error.message 
    });
  }

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ reviews: book.reviews });
  } catch(error) {
    console.error("Error fetching book reviews: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports.general = public_users;
