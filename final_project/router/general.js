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
  return res.status(200).json(books); // getting list of books available in shop
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbnParams = req.params.isbn;
  let book = books[isbnParams];
  
  // Check if the book exists
  if (book) {
    // Book found, return book
    return res.status(200).json(book);
  } else {
    // book not found, send error message
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let authorName = req.params.author.toLowerCase();
  let booksByAuthor = []; // filter books based on author names
  
  // Iterate through all books
  for (let isbn in books) {
    let book = books[isbn];

    // Check if the author matches
    if (book.author.toLowerCase() === authorName) {
      booksByAuthor.push(book);  // If matches, add the book to the result array
    }
  }

  // If books by the author are found, send them as response
  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const titleParam = req.params.title.toLowerCase();
  let bookFound = null;

  // Iterate through all books
  for (let isbn in books) {
    let book = books[isbn];

    // Check if book title matches
    if (book.title.toLowerCase() == titleParam) {
        bookFound = book;
        break; // exit if book is found
    }
  }

  // If books by the title are found, send it as response
  if (bookFound) {
    return res.status(200).json(bookFound);
  } else {
    return res.status(404).json({ message: "No books found by this title." });
  }  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  // If book exists, review is returned
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({message: "Book Review not found"});
});

module.exports.general = public_users;
