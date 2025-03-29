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
  let response = new Promise((resolve, reject) => {
    resolve(books);
  })

  response.then(bookList => {
    return res.status(200).json(bookList);
  }).catch((err) => {
    return res.status(500).json({ 
      message: "Error fetching books" ,
      error: err.message,
    });
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let response = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
      reject("Book not found");
    }
    resolve(book);
  });

  response.then((response) => {
    return res.status(200).json(response);
  }).catch (err => {
    return res.status(404).json({ message: "Book not found" });
  })
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let response = new Promise((resolve, reject) => {
    const author = req.params.author;
    const bookList = Object.keys(books).map(key => {
      return {
        isbn: key,
      ...books[key]
      }
    })
    const books2res = bookList.filter(book => book.author === author)
    resolve(books2res);
  });

  response.then(data => {
    return res.status(200).json(data);
  }).catch((err) => {
    return res.status(500).json({ 
      message: "Error fetching books by author" ,
      error: err.message,
    });
  });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let response = new Promise((resolve, reject) => {
    const title = req.params.title;
    const bookList = Object.keys(books).map(key => {
      return {
        isbn: key,
      ...books[key]
      }
    })
    const books2res = bookList.filter(book => book.title === title)
    resolve(books2res);
  });

  response.then(data => {
    return res.status(200).json(data);
  }).catch(err => {
    return res.status(500).json({ 
      message: "Error fetching books by title" ,
      error: err.message,
    });
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let response = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) {
      reject("Book not found");
    }
    resolve(book.reviews);
  })
  response.then((response) => {
    return res.status(200).json(response);
  }).catch((err) => {
    return res.status(404).json({ message: "Book not found" });
  })

  // const isbn = req.params.isbn;

  // axios({
  //   method: 'GET',
  //   adapter: () => {
  //     return Promise.resolve(books[isbn].reviews);
  //   }
  // }).then((response) => {
  //   let data = response.data || response;
  //   delete data.headers;
  //   return res.status(200).json(data);
  // }).catch((err) => {
  //   return res.status(500).json({ 
  //     message: "Error fetching reviews for book " + isbn,
  //     error: err.message,
  //   });
  // })
});

module.exports.general = public_users;
