const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isUserExistent(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered!"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  
  return res.status(404).json({message: "Unable to register user, please provide an username and password."});

});

const isUserExistent = (username) => {
  let userswithsamename = isValid(username);
  return userswithsamename.length > 0;
}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbnParam = req.params.isbn;

  for (let id in books) {
    if (books[id].isbn === isbnParam) {
      return res.status(200).json(books[id]);
    }
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorSearched = req.params.author;
  for (let id in books) {
    if (books[id].author.toLowerCase().includes(authorSearched.toLowerCase())) {
      return res.status(200).json(books[id]);
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleSearched = req.params.title;

  for (let id in books) {
    if (books[id].title.toLowerCase().includes(titleSearched.toLowerCase())) {
      return res.status(200).json(books[id]);
    }
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbnParam = req.params.isbn;

  for (let id in books) {
    if (books[id].isbn === isbnParam) {
      return res.status(200).json(books[id].reviews);
    }
  }
});

module.exports.general = public_users;
