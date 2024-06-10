const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');



// Get the book list available in the shop
public_users.get('/',function (req, res) {
  let booklist = books
  return res.status(300).json(JSON.stringify(booklist));
});

//get the list books using async-await with axios
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:5000/booksdb');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books", error: error.message });
  }
})



// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //retirve the ISBN from the request
  const isbn = req.params.isbn;

  //Find the book based on ISBN
  const book = books[isbn];

  //check if the book is found
  if(book){
    return res.status(200).json(book);
  }
  else{
  return res.status(404).json({message: "Book not found"});
 }});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Extract the author name from the request
  const author = req.params.author.toLowerCase();
  //Create an empty array to hold the books
  const bookByAuthor = [];
  //Loop through the books object
  for (const key in books){ //for...in Loop: this Loop iterates all key of `books` object
    if (books[key].author.toLowerCase() === author){ //check the author name
      bookByAuthor.push(books[key]); //store matching books in array
    }
  }

  if (bookByAuthor.length > 0){
    res.status(200).json(bookByAuthor);
  } else{
    res.status(404).json({message: "No books found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Extract the title name from the request
  const title = req.params.title.toLowerCase();
  //Create an empty array to hold the books
  const titleBooks = [];
  //Loop through the books object
  for (const key in books){ //for...in Loop: this Loop iterates all key of `books` object
    if (books[key].title.toLowerCase() === title){ //check the title name
      titleBooks.push(books[key]); //store matching books in array
    }
  }

  if (titleBooks.length > 0){
    res.status(200).json(titleBooks);
  } else{
    res.status(404).json({message: "No books found"});
  }});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  //Find the book based on ISBN
  const book = books[isbn];

  //check if the book is found
  if(book){
    return res.status(200).json(book);
  }
  else{
  return res.status(404).json({message: "Book not found"});
 }
});

module.exports.general = public_users;
