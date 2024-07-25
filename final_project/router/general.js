const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js'); 
let users = require('./auth_users.js').users; 
const public_users = express.Router();


const JWT_SECRET = 'your_jwt_secret_key'; 


const booksArray = Object.values(books);

// Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if the user already exists
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Register the new user
  users.push({ username, password });
  return res.status(201).json({ message: 'User registered successfully' });
});

// Login a user
public_users.post('/customer/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Find the user
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Generate a JWT token
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ message: 'Login successful', token });
  } else {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
});

// Get the list of all books
public_users.get('/', (req, res) => {
  return res.json(booksArray);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = booksArray.find(b => b.isbn === isbn);
  
  if (book) {
    return res.json(book);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Get books based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const filteredBooks = booksArray.filter(b => b.author.toLowerCase() === author.toLowerCase());
  
  if (filteredBooks.length > 0) {
    return res.json(filteredBooks);
  } else {
    return res.status(404).json({ message: 'No books found by this author' });
  }
});

// Get books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const filteredBooks = booksArray.filter(b => b.title.toLowerCase().includes(title.toLowerCase()));
  
  if (filteredBooks.length > 0) {
    return res.json(filteredBooks);
  } else {
    return res.status(404).json({ message: 'No books found with this title' });
  }
});

// Get book review based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = booksArray.find(b => b.isbn === isbn);
  
  if (book) {
    return res.json({ reviews: book.reviews || {} }); // Return reviews if available
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.general = public_users;

// Function to fetch all books
const fetchBooks = () => {
  return axios.get('http://localhost:5000/')
    .then(response => {
      console.log('Books:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error fetching books:', error);
      throw error;
    });
};

// Function to fetch book details by ISBN
const fetchBookByISBN = (isbn) => {
  return axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      console.log('Book Details:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error fetching book details:', error);
      throw error;
    });
};

// Function to fetch books by Author
const fetchBooksByAuthor = (author) => {
  return axios.get(`http://localhost:5000/author/${author}`)
    .then(response => {
      console.log('Books by Author:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error fetching books by author:', error);
      throw error;
    });
};

// Function to fetch books by Title
const fetchBooksByTitle = (title) => {
  return axios.get(`http://localhost:5000/title/${title}`)
    .then(response => {
      console.log('Books by Title:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error fetching books by title:', error);
      throw error;
    });
};

// Call the functions
fetchBooks();
fetchBookByISBN('0-02-044520-0');
fetchBooksByAuthor('Dante Alighieri');
fetchBooksByTitle('Pride and Prejudice');
