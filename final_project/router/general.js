const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({message: "Username and password are required"});
  }
  
  // Check if username is valid
  if (!isValid(username)) {
    return res.status(400).json({message: "Invalid username"});
  }
  
  // Check if user already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }
  
  // Add user to users array
  users.push({username, password});
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Using JSON.stringify for formatted output as required
  res.send(JSON.stringify(books, null, 4));
});

// Task 10: Get all books using Promise
public_users.get('/books-promise', function (req, res) {
  // Return a new Promise
  const getAllBooks = new Promise((resolve, reject) => {
    try {
      // Simulate an API call by resolving with the books data
      resolve(books);
    } catch (error) {
      reject(error);
    }
  });

  // Handle the Promise
  getAllBooks
    .then(books => {
      res.send(JSON.stringify(books, null, 4));
    })
    .catch(error => {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    });
});

// Task 10: Get all books using async-await and Axios
public_users.get('/books-async', async function (req, res) {
  try {
    // Create a baseURL for our server
    const baseURL = `http://${req.headers.host}`;
    
    // Make axios call to our own API to simulate external API request
    const response = await axios.get(`${baseURL}/`);
    
    // Send the response data
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    // Using JSON.stringify for formatted output as required
    res.send(JSON.stringify(books[isbn], null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

// Task 11: Get book by ISBN using Promise
public_users.get('/isbn-promise/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  // Return a new Promise
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject(new Error("Book not found"));
    }
  });

  // Handle the Promise
  getBookByISBN
    .then(book => {
      res.send(JSON.stringify(book, null, 4));
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});

// Task 11: Get book by ISBN using async-await and Axios
public_users.get('/isbn-async/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const baseURL = `http://${req.headers.host}`;
    
    // Make axios call to our own API to simulate external API request
    const response = await axios.get(`${baseURL}/isbn/${isbn}`);
    
    // Send the response data
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "Book not found" });
    } else {
      res.status(500).json({ message: "Error fetching book", error: error.message });
    }
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  
  // Get all book keys and find books matching the author
  const bookKeys = Object.keys(books);
  let booksByAuthor = [];
  
  for (let i = 0; i < bookKeys.length; i++) {
    const book = books[bookKeys[i]];
    if (book.author === author) {
      booksByAuthor.push(book);
    }
  }
  
  if (booksByAuthor.length > 0) {
    // Using JSON.stringify for formatted output as required
    res.send(JSON.stringify(booksByAuthor, null, 4));
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Task 12: Get books by author using Promise
public_users.get('/author-promise/:author', function (req, res) {
  const author = req.params.author;
  
  // Return a new Promise
  const getBooksByAuthor = new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    let booksByAuthor = [];
    
    for (let i = 0; i < bookKeys.length; i++) {
      const book = books[bookKeys[i]];
      if (book.author === author) {
        booksByAuthor.push(book);
      }
    }
    
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject(new Error("No books found by this author"));
    }
  });

  // Handle the Promise
  getBooksByAuthor
    .then(booksList => {
      res.send(JSON.stringify(booksList, null, 4));
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});

// Task 12: Get books by author using async-await and Axios
public_users.get('/author-async/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const baseURL = `http://${req.headers.host}`;
    
    // Make axios call to our own API to simulate external API request
    const response = await axios.get(`${baseURL}/author/${author}`);
    
    // Send the response data
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "No books found by this author" });
    } else {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  
  // Get all book keys and find books matching the title
  const bookKeys = Object.keys(books);
  let booksByTitle = [];
  
  for (let i = 0; i < bookKeys.length; i++) {
    const book = books[bookKeys[i]];
    if (book.title === title) {
      booksByTitle.push(book);
    }
  }
  
  if (booksByTitle.length > 0) {
    // Using JSON.stringify for formatted output as required
    res.send(JSON.stringify(booksByTitle, null, 4));
  } else {
    return res.status(404).json({message: "No books found with this title"});
  }
});

// Task 13: Get books by title using Promise
public_users.get('/title-promise/:title', function (req, res) {
  const title = req.params.title;
  
  // Return a new Promise
  const getBooksByTitle = new Promise((resolve, reject) => {
    const bookKeys = Object.keys(books);
    let booksByTitle = [];
    
    for (let i = 0; i < bookKeys.length; i++) {
      const book = books[bookKeys[i]];
      if (book.title === title) {
        booksByTitle.push(book);
      }
    }
    
    if (booksByTitle.length > 0) {
      resolve(booksByTitle);
    } else {
      reject(new Error("No books found with this title"));
    }
  });

  // Handle the Promise
  getBooksByTitle
    .then(booksList => {
      res.send(JSON.stringify(booksList, null, 4));
    })
    .catch(error => {
      res.status(404).json({ message: error.message });
    });
});

// Task 13: Get books by title using async-await and Axios
public_users.get('/title-async/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const baseURL = `http://${req.headers.host}`;
    
    // Make axios call to our own API to simulate external API request
    const response = await axios.get(`${baseURL}/title/${title}`);
    
    // Send the response data
    res.send(JSON.stringify(response.data, null, 4));
  } catch (error) {
    if (error.response && error.response.status === 404) {
      res.status(404).json({ message: "No books found with this title" });
    } else {
      res.status(500).json({ message: "Error fetching books", error: error.message });
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    // Using JSON.stringify for formatted output as required
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
