const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let newUserName = req.body.username;
  let newUserPass = req.body.password;
  if(!newUserName || !newUserPass) {
    return res.status(401).json({message: "Missing value for username or password"})
  }
  let existenceValidation = users.filter(user => compareExistence(user, newUserName));
  console.log(existenceValidation)
  if(existenceValidation.length > 0) {
    return res.status(401).json({message: "User is already registered"})
  } else {
    users.push({username: newUserName, password: newUserPass});
    return res.status(300).json({message: "New user registered!"})
  }
  function compareExistence(user, entry) {
    return user.username === entry;
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.status(300).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbnFilter = req.params.isbn;
  console.log(isbnFilter)
  return res.status(300).send(JSON.stringify(books[isbnFilter]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let authorQuery = req.params.author;
    let authorObj = {}
    Object.keys(books).forEach(book => {
        if(books[book].author === authorQuery.replaceAll("_", " ")) {
            authorObj = books[book];
        }
    });
    return res.status(300).send(JSON.stringify(authorObj))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let titleQuery = req.params.title;
  let titleObj = {};
  Object.keys(books).forEach(book => {
    if(books[book].title === titleQuery.replaceAll("_", " ") || books[book].title.indexOf(titleQuery) > -1) {
        titleObj = books[book];
    }
  })
  return res.status(300).send(JSON.stringify(titleObj));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let reviewQuery = req.params.isbn;
  if(books[reviewQuery]) {
    return res.status(300).json(books[reviewQuery].reviews)
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
