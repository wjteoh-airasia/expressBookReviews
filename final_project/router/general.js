const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bcrypt= require("bcryptjs");


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;
  // username = username.trim();
  

  // Check if username and password are provided
  if (!username || !password) {
    res.status(400).send("Username and password are required");
    return;
  }

  // Check if username  is valid
  if (!isValid(username)) {
    res.status(409).send("Invalid, something is fishy about your username");
    return;
  }

   // Check if username already exists
   if (users.find((user) => user.username === username)) {
    res.status(409).send(`Username ${username} already exists`);
    return;
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Add the new user to the users array
  users.push({ username, password: hashedPassword });

  res.send(`User ${username} registered successfully`);

   // res.send(`NEW User ${username} registered successfully`);
});

//get list of books available in the shop
const axios = require('axios'); 
public_users.get('/', function (req, res) { 
   //  API URL 
  axios.get('http://localhost:5000')
 .then(response => { 
  const books = response.data; 
  const booksJson = JSON.stringify(books, null, 2); 
  res.send(` 
    <html> 
      <body> 
        <h1>Book List</h1>
        <pre>${booksJson}</pre> 
     </body> 
    </html> 
    `);
     }) .catch(error => { 
      console.error('Error fetching books list:', error);
       res.status(500).send('Error fetching books list'); 
      }); 
    });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
 const isbn = req.params.isbn;
//  const book = books.find(b=> b.isbn === isbn );
 
 if (!isbn) {
  res.status(404).send(`Book not found with ISBN ${isbn}`);
 } else{
  return res.status(404).json({message: "ISBN not found, chech isbn and try again or use other descriptions"})
  const bookJson = JSON.stringify(books, null, 2);
  res.send(`
    <html>
      <body>
        <h1>Book details</h1>
        <pre>${bookJson}</pre>
      </body>
    </html>
    `)
 }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const books=require("./booksdb.js")
  const author = req.params.author;
  //obtain all the keys for the  books object
  const bookKeys =Object.keys(books) 
 // initializing an empty array to store book by specific author

 const boookByAuthor= [];
 //iterate through the book array to check if author matches
 bookKeys.forEach(key=> {
  if (books[key].author.toLowerCase() === title.toLowerCase())
    {
      boookByAuthor.push(books[key]);
     }
 });
 //check if any books were found by the author
 if (boookByAuthor.length === 0)
{
  res.status(404).send(`No books found by title ${author}`);

 } else{
  //return the books by the title in json format

  const booksJson = JSON.stringify(boookByAuthor, null, 2);
  res.send(`
   <html>
      <body>
        <h1>Book by ${author}</h1>
        <pre>${booksJson}</pre>
      </body>
    </html> 
    `)
 }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const books=require("./booksdb.js")
  const title = req.params.title;
  //obtain all the keys for the  books object
  const bookKeys =Object.keys(books) 
 // initializing an empty array to store book by specific title

 const boookByTitle= [];
 //iterate through the book array to check if title matches
 bookKeys.forEach(key=> {
  if (books[key].title.toLowerCase() === title.toLowerCase())
    {
      boookByTitle.push(books[key]);
     }
 });
 //check if any books were found by the title
 if (boookByTitle.length === 0)
{
  res.status(404).send(`No books found by title ${title}`);

 } else{
  //return the books by the title in json format

  const booksJson = JSON.stringify(boookByTitle, null, 2);
  res.send(`
   <html>
      <body>
        <h2>Related Book to the search:${title}</h2>
        <pre>${booksJson}</pre>
      </body>
    </html> 
    `)
 }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const books = require("./booksdb.js");
  const isbn = req.params.isbn;

  // Obtain all the keys for the 'books' object
  const bookKeys = Object.keys(books);

  // Initialize an empty array to store book reviews by ISBN
  const bookReviews = [];

  // Iterate through the book arrays and check if the ISBN matches
  bookKeys.forEach(key => {
    if (books[key].isbn === isbn) {
      bookReviews.push({
        title: books[key].title,
        author: books[key].author,
        reviews: books[key].reviews
      });
    }
  });

  // Check if any book reviews were found by the ISBN
  if (bookReviews.length === 0) {
    res.status(404).send(`No book reviews found with ISBN ${isbn}`);
  } else {
    // Return the book reviews in JSON format
    const reviewsJson = JSON.stringify(bookReviews, null, 2);
    res.send(`
      <html>
        <body>
          <h1>Book Reviews for ISBN: ${isbn}</h1>
          <pre>${reviewsJson}</pre>
        </body>
      </html>
    `);
  };
});

module.exports.general = public_users;
