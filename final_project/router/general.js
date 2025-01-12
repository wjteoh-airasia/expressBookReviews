const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const authorName = req.params.author;
  const bookDetails = [];

  for (let id in books) {
    if (books[id].author.toLowerCase() === authorName.toLowerCase()) {
      bookDetails.push({
        isbn: books[id].isbn,
        author: books[id].author,
        title: books[id].title,
        reviews: books[id].reviews
      });
    }
  }

  if (bookDetails.length > 0) {
    return res.status(200).json(bookDetails);
  } else {
    return res.status(404).json({ message: `No books found by author: ${authorName}`});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const bookTitle = req.params.title;
  const bookDetails = [];

  for (let id in books) {
    if (books[id].title.toLowerCase() === bookTitle.toLowerCase()) {
      bookDetails.push({
        isbn: books[id].isbn,
        author: books[id].author,
        title: books[id].title,
        reviews: books[id].reviews
      });
    }
  }

  if (bookDetails.length > 0) {
    return res.status(200).json(bookDetails);
  } else {
    return res.status(404).json({ message: `No books with title: ${bookTitle}`});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
