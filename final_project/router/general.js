const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
        // Add the new user to the users array
        users.push({"username": username, "password": password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
        return res.status(404).json({message: "User already exists!"});
    }
}
// Return error if username or password is missing
return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get the book list available in the shop
public_users.get('/task10',function (req, res) {
// Promise zur Rückgabe der Bücherliste
const getBooks = new Promise((resolve, reject) => {
  if (books) {
    resolve(books); // Bücherliste auflösen
  } else {
    reject("No books available."); // Fehler auslösen, wenn keine Bücher verfügbar sind
  }
});

// Promise verarbeiten
getBooks
  .then((books) => {
    res.send(JSON.stringify(books, null, 4)); // Erfolgreich die Bücher zurückgeben
  })
  .catch((err) => {
    res.status(500).send(err); // Fehler an den Client senden
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });

 // Get book details based on ISBN
public_users.get('/task11/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
    if(books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then((book) => {
      res.send(JSON.stringify(book,null,4));
    })
    .catch((err) => {
      res.status(404).send(err);
    })
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  let filtered_author = Object.values(books).filter(books => books.author === author);

  res.send(filtered_author);
});

// Get book details based on author
public_users.get('/task12/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  const getBookByAuthor = new Promise((resolve, reject) => {
    const filtered_author = Object.values(books).filter(books => books.author === author);

    if(filtered_author.length > 0) {
      resolve(filtered_author);
    } else {
      reject("No books found for this author");
    
    }
  });
    getBookByAuthor
      .then((book) => {
        res.send(JSON.stringify(book,null,4));
      })
      .catch((err) => {
        res.status(404).send(err);
      });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  let filtered_title = Object.values(books).filter(books => books.title === title);

  res.send(filtered_title);
});

// Get all books based on title
public_users.get('/task13/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  const getBookByTitle = new Promise((resolve, reject) => {
    let filtered_title = Object.values(books).filter(books => books.title === title);

    if(filtered_title.length > 0) {
      resolve(filtered_title);
    } else {
      reject("No books found with this title");
    }
  });

  getBookByTitle
    .then((book) => {
      res.send(JSON.stringify(book,null,4));
    })
    .catch((err) => {
      res.status(404).send(err);
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
