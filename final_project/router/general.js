const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

    // Check for missing username or password
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username already exists
    const exists = users.find(user => user.username === username);
    if (exists) {
        return res.status(409).json({ message: "Username already exists." });
    }

    // Register the new user
    const newUser = { username, password };
    users.push(newUser);
    res.status(201).json({ message: "User registered successfully.", user: newUser });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
       try {
           // Mocking an API call using Promise.resolve
           const bookList = await new Promise((resolve, reject) => {
               resolve(books); // Simulate successful fetch
           });
           return res.status(200).json(bookList);
       } catch (error) {
           return res.status(500).json({ message: 'Error fetching book list' });
       }
     });
module.exports = public_users;
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
       //Write your code here
       let isbn = req.params.isbn
       if(books[isbn]){
         return res.status(200).json(books[isbn]);
       }else {
         return res.status(404).json({ message: "Book not found" });
       }
      });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
         let authorName = req.params.author.toLowerCase();
         let booksByAuthor = [];
         for (let bookId in books) {
             if (books[bookId].author.toLowerCase() === authorName) {
                 booksByAuthor.push(books[bookId]);
             }
             }
             if (booksByAuthor.length > 0) {
             return res.status(200).json(booksByAuthor);
             } else {
             return res.status(404).json({ message: "No books found by this author" });
             }
     });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
       let title = req.params.title.toLowerCase();
       let booksByTitle = [];
       for(let bookId in books){
         if(books[bookId].title.toLowerCase() === title){
             booksByTitle.push(books[bookId]);
         }
       }
       if (booksByTitle.length > 0) {
         return res.status(200).json(booksByTitle);
         } else {
         return res.status(404).json({ message: "No books found by this title" });
         }
     });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books.find(book => book.isbn === isbn);

    if (book && book.reviews) {
        res.status(200).json(book.reviews);
    } else {
        res.status(404).json({ message: "No reviews found or book does not exist for this ISBN" });
    }
});

module.exports.general = public_users;
