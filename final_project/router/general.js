const express = require('express');
let booksDB = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {


  return res.status(200).json(JSON.stringify(booksDB.books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).json({message: "Error, please input an isbn"});
  }

  if (!booksDB.books.hasOwnProperty(isbn)) {
    return res.status(200).json({ message: `ISBN '${isbn}' not found in bookstore.` });
  }

  return res.status(200).json(JSON.stringify(booksDB.books[isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  if (!author) {
    return res.status(404).json({message: "Error, please input an author"});
  }

  const foundBooks = Object.values(booksDB.books).filter((value) => value.author.toLowerCase() === author.toLowerCase());
  if (foundBooks.length === 0) {
    return res.status(200).json({ message: `Author '${author}' not found in bookstore.` });
  }

  return res.status(200).json(JSON.stringify(foundBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  if (!title) {
    return res.status(404).json({message: "Error, please input an title"});
  }

  const foundBooks = Object.values(booksDB.books).filter((value) => value.title.toLowerCase() === title.toLowerCase());
  if (foundBooks.length === 0) {
    return res.status(200).json({ message: `Title '${title}' not found in bookstore.` });
  }

  return res.status(200).json(JSON.stringify(foundBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).json({message: "Error, please input an isbn"});
  }

  if (!booksDB.books.hasOwnProperty(isbn)) {
    return res.status(200).json({ message: `ISBN '${isbn}' not found in bookstore.` });
  }

  return res.status(200).json(JSON.stringify(booksDB.books[isbn].reviews));
});

module.exports.general = public_users;
