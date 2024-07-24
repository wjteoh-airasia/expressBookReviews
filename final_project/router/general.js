const express = require('express');
let books = require("./booksdb.js");
const { ImageBackgroundComponent } = require('react-native');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  try {
    return res.status(200).send(JSON.stringify(books));
  } catch (error) {
    return res.status(300).json({ message: "Yet to be implemented" });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here

  try {
    const isbn = req.params.isbn;
    let booksArray = Object.keys(books);
    let filter_isbn = booksArray.map((key)=>books[key]).filter((book)=>book.isbn === isbn);
    return res.status(200).send(JSON.stringify(filter_isbn))
  } catch (error) {

  return res.status(300).json({ message: "Yet to be implemented" });
    
  }
  
 


});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    let booksArray = Object.keys(books)
    let filter_author = booksArray.map((key) => books[key]).filter((book) => book.author === author);
    return res.status(200).send(JSON.stringify(filter_author))
  } catch {
    return res.status(300).json({ message: "Yet to be implemented" });
  }


});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
