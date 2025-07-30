const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  
return res.send})

// Get the book list available in the shop
public_users.get('/', (req, res) => {
    return res.status(200).json(books);
  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn]
  if (book){
    return res.status(200).json({
        message: "Your book details:",
        book: book
      });
  }else{
  return res.status(404).json({message: "No book found"});
 }});
  

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase().trim();
  const matchingBooks = [];

  // Get all keys from the books object
  const keys = Object.keys(books);

  // Loop through each book and compare the author
  keys.forEach(key => {
    const book = books[key];
    if (book.author.toLowerCase().trim() === author) {
      // Add to result array
      matchingBooks.push({ isbn: key, ...book });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json({
      message: `Books by ${req.params.author}:`,
      books: matchingBooks
    });
  } else {
    return res.status(404).json({ message: `No books found by author ${req.params.author}` });
  }});;

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase().trim();
  const matchingBooks = [];

  // Get all keys from the books object
  const keys = Object.keys(books);

  keys.forEach(key => {
    const book = books[key];
    if (book.title.toLowerCase().trim() === title) {
      // Add to result array
      matchingBooks.push({ isbn: key, ...book });
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).json({
      message: `Book "${req.params.title}"`,
      books: matchingBooks
    });
  } else {
    return res.status(404).json({ message: `No books found with name ${req.params.title}` });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
