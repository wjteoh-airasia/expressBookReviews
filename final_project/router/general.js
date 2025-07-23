const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
   const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });;
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(users);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;
    // Filter the users array to find users whose lastName matches the extracted lastName parameter
    let filtered_isbn = users.filter((user) => user.isbn === isbn);
    // Send the filtered_lastname array as the response to the client
    res.send(filtered_isbn);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
    // Filter the users array to find users whose lastName matches the extracted lastName parameter
    let filtered_author = users.filter((user) => user.author === author);
    // Send the filtered_lastname array as the response to the client
    res.send(filtered_author);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
   const title = req.params.title;
    // Filter the users array to find users whose lastName matches the extracted lastName parameter
    let filtered_title = users.filter((user) => user.title === title);
    // Send the filtered_lastname array as the response to the client
    res.send(filtered_title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
 
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.status(200).json({ reviews: book.reviews });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
