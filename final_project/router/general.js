const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6
// Register New user
public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User <<" + (username) + ">> successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User <<" + (username) + ">> already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

//  Task 1
//  Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try {
    const bookList = await getBooks(); 
    res.json(bookList); // Neatly format JSON output
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving book list" });
  }
});

// Task 10
// Get all books – Using async callback function
const getBooks = () => {
  return new Promise((resolve, reject) => {
      resolve(books);
  });
};

// Task 2
// Get the books based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  getByISBN(req.params.isbn)
  .then(
      result => res.send(result),
      error => res.status(error.status).json({message: error.message})
  );
});

// Task 11
// Search by ISBN – Using Promises
const getByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
      let isbnNum = parseInt(isbn);
      if (books[isbnNum]) {
          resolve(books[isbnNum]);
      } else {
          reject({ status: 404, message: `ISBN ${isbn} not found` });
      }
  });
};

// Task 3 & Task 12
// Get all books by Author | Search by Author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book) => book.author === author))
  .then((filteredBooks) => res.send(filteredBooks));
});

// Task 4 & Task 13
// Get all books based on Title | Search by Title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  getBooks()
  .then((bookEntries) => Object.values(bookEntries))
  .then((books) => books.filter((book) => book.title === title))
  .then((filteredBooks) => res.send(filteredBooks));
});

// Task 5
// Get book Review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  getByISBN(req.params.isbn)
  .then(
      result => res.send(result.reviews),
      error => res.status(error.status).json({message: error.message})
  );
});

module.exports.general = public_users;
