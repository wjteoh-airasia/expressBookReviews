const express = require('express');
let books = require("./booksdb.js");
const { error } = require('selenium-webdriver');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username, password } = req.body;

  if(!username || !password){
    return res.status(400).json({message: "Username and password are required."});
  }
  const userExist = users.some(user => user.username === username );
  if (userExist){
    return res.status(400).json({message: "Username already exists"});
  }
  users.push({username, password});
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  try {
    const formattedBooks = JSON.stringify(books);
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(formattedBooks);
  } catch (error) {
    console.error('Error fetching books:', error);
    return res.status(500).json({ message: 'Error retrieving book list' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  try{
    const isbn = req.params.isbn;
    const isbnBooks =books[isbn];
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(isbnBooks) 
  }catch(error){
    console.error("Error fetching books:", error);
    return res.status(500).json({message: "Error fetching books"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  try {
    const authorParam = req.params.author.toLowerCase();
    const bookKeys = Object.keys(books);  
    const booksByAuthor = [];

    for (const id of bookKeys) { 
      const book = books[id];   
      if (book.author.toLowerCase().includes(authorParam)) { 
        booksByAuthor.push({
          id: id,
          title: book.title,
          author: book.author
        });
      }
    }

    if (booksByAuthor.length === 0) {
      return res.status(404).json({ message: "No book found under the Author Name" }); 
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    console.error('Error fetching books by author:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  try{
    const title = req.params.title.toLowerCase();
    const bookKeys = Object.keys(books);
    const booksBytitle = []

    for (const key of bookKeys){
      const book = books[key];
      if(book.title.toLowerCase().includes(title)){
        booksBytitle.push({
          title: book.title,
          id: book.id,
          author: book.author,
        });
      }
    }
    if (booksBytitle.length === 0){
      return res.status(200).json({message: "No books found under the Title Name."});
    }

    return res.status(200).json(booksBytitle)
  } catch(error){
    console.error("Error fetching books by the title", error);
    res.status(500).json({ message: 'Internal Server Error' })
  }

});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({ reviews: book.reviews });
  } catch(error) {
    console.error("Error fetching book reviews: ", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports.general = public_users;
