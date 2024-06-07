const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "Customer already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
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
  const author = req.params.author;
    let filtered_books = Object.keys(books)
    .filter(key => books[key].author === author)
    .reduce((obj, key) => {
      obj[key] = books[key];
      return obj;
    }, {});
    const booksByAuthor = Object.entries(filtered_books).map(([isbn, book]) => ({
        isbn,
        title: book.title,
        reviews: book.reviews
    }));
    res.json({ booksbyauthor: booksByAuthor });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
    let filtered_books = Object.keys(books)
    .filter(key => books[key].title === title)
    .reduce((obj, key) => {
      obj[key] = books[key];
      return obj;
    }, {});

    const booksByTitle = Object.entries(filtered_books).map(([isbn, book]) => ({
        isbn,
        author: book.author,
        reviews: book.reviews
    }));
    
    res.json({ booksbytitle: booksByTitle });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const reviewsByIsbn = books[isbn].reviews;
  res.send(reviewsByIsbn);
});



// Tasks 1-4 using Promises or Async-Await

// Task 10

const getListOfBooks = async (url) => {
    const outcome = await axios.get(url);
    let listOfBooks = outcome.data;

    console.log('----------------');
    console.log('Get List Of Books');
    console.log('----------------');
    Object.values(listOfBooks).forEach((book) => {
        console.log(`Author: ${book.author}`);
        console.log(`Title: ${book.title}`);
        console.log(`Reviews: ${JSON.stringify(book.reviews)}`);
        console.log('----------------');
    });
    console.log('\n');
}

getListOfBooks(
    'https://joshmatparro-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/'
).catch(err => console.log(err.toString()));


// Task 11

const getBookByISBN = async (url, isbn) => {
    const outcome = await axios.get(url + isbn);
    let book = outcome.data;
    console.log('----------------');
    console.log('Get Book By ISBN');
    console.log('----------------');

    console.log(`Author: ${book.author}`);
    console.log(`Title: ${book.title}`);
    console.log(`Reviews: ${JSON.stringify(book.reviews)}`);
    console.log('----------------');
    console.log('\n');
}

getBookByISBN(
    'https://joshmatparro-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/',
    2
).catch(err => console.log(err.toString()));



// Task 12

const getBookByAuthor = async (url, author) => {
    const outcome = await axios.get(url + author);
    let book = outcome.data.booksbyauthor;
    console.log('----------------');
    console.log('Get Book By Author');
    console.log('----------------');

    Object.values(book).forEach(item => {
        console.log(`ISBN: ${item.isbn}`);
        console.log(`Title: ${item.title}`);
        console.log(`Reviews: ${JSON.stringify(item.reviews)}`);
        console.log('----------------');
    });

    console.log('\n');
}

getBookByAuthor(
    'https://joshmatparro-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/',
    'Hans Christian Andersen'
).catch(err => console.log(err.toString()));


// Task 13

const getBookByTitle = async (url, title) => {
    const outcome = await axios.get(url + title);
    let book = outcome.data.booksbytitle;
    console.log('----------------');
    console.log('Get Book By Title');
    console.log('----------------');

    book.forEach(item => {
        console.log(`ISBN: ${item.isbn}`);
        console.log(`Author: ${item.author}`);
        console.log(`Reviews: ${JSON.stringify(item.reviews)}`);
        console.log('----------------');
    });

    console.log('\n');
}

getBookByTitle(
    'https://joshmatparro-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/',
    'Fairy tales'
).catch(err => console.log(err.toString()));


module.exports.general = public_users;
