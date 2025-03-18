const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// Register users with password
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username) {
    return res.status(400).json({message: "Username is required"});
  } else if (!password) {
    return res.status(400).json({message: "Password is required"});
  } else if (!isValid(username)) {
    return res.status(409).json({message: "Username already exists"});
  } else {
    users.push({ "username": username, "password": password });
    return res.status(201).json({message: "User registered successfully"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  axios({
    method: 'GET',
    adapter: () => {
      return Promise.resolve(books);
    }
  }).then((response) => {
    return res.status(200).json(response.data || response);
  }).catch((err) => {
    return res.status(500).json({ 
      message: "Error fetching books" ,
      error: err.message,
    });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  axios({
    method: 'GET',
    adapter: () => {
      return Promise.resolve(books[isbn]);
    }
}).then((response) => {
  return res.status(200).json(response.data || response);
}).catch((err) => {
  return res.status(500).json({ 
    message: "Error fetching book details" ,
    error: err.message,
  });
});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  axios({
    method: 'GET',
    adapter: () => {
      const bookList = [];
      for (const key of Object.keys(books)) {
        if (books[key].author === author) {
          bookList.push(books[key]);
        }
      }
      return Promise.resolve(bookList);
    }
  }).then((response) => {
    return res.status(200).json(response.data || response);
  }).catch((err) => {
    return res.status(500).json({ 
      message: "Error fetching books by author" ,
      error: err.message,
    });
  })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;

  axios({
    method: 'GET',
    adapter: () => {
      const bookList = [];
      for (const key of Object.keys(books)) {
        if (books[key].title === title) {
          bookList.push(books[key]);
        }
      }
      return Promise.resolve(bookList);
    }
  }).then((response) => {
    return res.status(200).json(response.data || response);
  }).catch((err) => {
    return res.status(500).json({ 
      message: "Error fetching books by title" ,
      error: err.message,
    });
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  axios({
    method: 'GET',
    adapter: () => {
      return Promise.resolve(books[isbn].reviews);
    }
  }).then((response) => {
    return res.status(200).json(response.data || response);
  }).catch((err) => {
    return res.status(500).json({ 
      message: "Error fetching reviews for book " + isbn,
      error: err.message,
    });
  })
});

module.exports.general = public_users;
