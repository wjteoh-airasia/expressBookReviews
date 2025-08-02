const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // 1. Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // 2. Check if user already exists
  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // 3. Add user to array
  users.push({ username, password });

  return res.status(200).json({ message: "User successfully registered. Now you can login." });
  })


// Get the book list available in the shop
public_users.get('/', (req, res) => {
    new Promise((resolve, reject)=>{
        resolve(books)
    }).then(data => {
    return res.status(200).json(data)})
    .then (err =>{
        return res.status(500).json(err)
    });
  });


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  new Promise((resolve, reject)=>{})
  const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("No book found");
    }
  })
  .then(book => {
    return res.status(200).json({
      message: "Your book details:",
      book: book
    });
  })
  .catch(error => {
    return res.status(404).json({ message: error });
  });
  

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
  const isbn = req.params.isbn;
  const book = books[isbn]
  const reviews = book.reviews;
  if (reviews){
    return res.status(200).json({
        message: `Your book reviews for book ${book.title}: `,
        reviews: book.reviews
      });
  }else{
  return res.status(404).json({message: "No reviews found"});
}});

module.exports.general = public_users;
