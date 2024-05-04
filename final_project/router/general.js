const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  
  // Validate username and password input
  if (!username || !password) {
    return res.status(400).json({ error: 'Please provide both username and password.' });
  }
  

  if (isValid(username)) {
    return res.status(400).json({ error: 'This username is already registered.' });
  }
  
  // Register new user
  users.push({ username, password });
  res.status(201).json({ message: 'User registered successfully.' });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return new Promise((resolve, reject) => {
    if (Object.keys(books).length === 0) {
        reject({message: "No books available"})
    }
    resolve(books)
  
  }).then((result) => {
    return res.status(200).json(result);
  }).catch((err) => {
    return res.status(404).json(err);
  })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  return new Promise((resolve, reject) => {
    const { isbn } = req.params;
    const result = books[isbn]

    if (!result) {
      reject({message: "Book not found"})
    }
    resolve(result)
    
  }).then((result) => {
    return res.status(200).json(result);
  }).catch((err) => {
    return res.status(404).json(err);
  })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  return new Promise((resolve, reject) => {
    const { author } = req.params;
    const result = Object.entries(books)
        .filter(([, value]) => value.author === author)
        .map(([, value]) => value)

    if (result.length === 0) {
      reject({message: "Author not found"})
    }
    resolve(result)
    
  }).then((result) => {
    return res.status(200).json(result);
  }).catch((err) => {
    return res.status(404).json(err);
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  return new Promise((resolve, reject) => {
    const { title } = req.params;
    
    const result = Object.entries(books)
        .filter(([, value]) => value.title === title)
        .map(([, value]) => value)
    
    if (result.length === 0) {
      reject({message: "Tile not found"})
    }
    resolve(result)
    
  }).then((result) => {
    return res.status(200).json(result);
  }).catch((err) => {
    return res.status(404).json(err);
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params['isbn']
  const result = books[isbn]?.reviews

  if (!result) {
    return res.status(404).json({message: "isbn not found"})
  }
  return res.status(200).json(result);
});

module.exports.general = public_users;
