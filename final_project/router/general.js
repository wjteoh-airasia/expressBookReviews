let axios = require('axios');

const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const alreadyExists = (username) => {
  let foundUsers = users.filter((user) => {
    return user.username === username;
  });
  if(foundUsers.length > 0) return true;
  else return false;
}


public_users.post("/register", (req,res) => {
  username = req.body.username;
  password = req.body.password;

  if(!username || !password){ return res.status(404).json({message: "Please provide username and password"}); }
  
  if(alreadyExists(username)){ return res.status(404).json({message: "User already exists!"}); }
  else {
    users.push({"username": username, "password":password});
    return res.status(200).json({message:"User registered successfully"});
  }


  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  new Promise((resolve, reject) => {
    let mybooks = books;
    if(mybooks){
      resolve(mybooks);
    } else {
      reject("Rejected!")
    }
  })
  .then(mybooks => {
    res.send(JSON.stringify(mybooks, null, 4));
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: "error getting the books"});
  })
});

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   let isbn = req.params.isbn;
//   if(isbn) {
//     res.send(JSON.stringify(books[isbn], null, 4));
//   }
//   res.send("ISBN not found")
//   // return res.status(300).json({message: "Yet to be implemented"});
//  });
public_users.get('/isbn/:isbn', (req, res) => {
  let isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if(books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("No book found");
    }
  })
  .then(book => {
    res.send(JSON.stringify(book, null, 4));
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({message: "There was an error retrieving the book"});
  });
});
  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//   const author = req.params.author;
//   const authorBooks = [];
//   for(book of Object.entries(books)) {
//     // console.log("iterating")
//     const details = book[1];
//     // console.log(details);
//     if(details['author'] === author) {
//       // console.log("found?")
//       authorBooks.push(book);
//     }
//   }
//   res.send(JSON.stringify(authorBooks, null, 4)); 
  
  
// });
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const authorbooks = [];
  new Promise((resolve, reject) => {
    for(book of Object.entries(books)) {
      const details = book[1];
      if(details['author'] === author){
        authorbooks.push(book);
      }
    }
    if(authorbooks.length > 0) {
      resolve(authorbooks);
    } else {
      reject("No books found.");
    }
  }).then(authorBooks => {
    res.send(JSON.stringify(authorbooks, null, 4));
  })
  .catch(err => {
    console.error(error);
    return res.status(500).json({message: "There was an error retrieving the books."});
  })
})

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   const booksByTitle = [];
//   for(book of Object.entries(books)){
//     const details = book[1];
//     if(details['title'] === title) {
//       booksByTitle.push(book);
//     }
//   }
//   res.send(JSON.stringify(booksByTitle, null, 4));
// });

public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const titlebooks = [];
  new Promise((resolve, reject) => {
    for(book of Object.entries(books)) {
      const details = book[1];
      if(details['title'] === title){
        titlebooks.push(book);
      }
    }
    if(titlebooks.length > 0) {
      resolve(titlebooks);
    } else {
      reject("No books found.");
    }
  }).then(titlebooks => {
    res.send(JSON.stringify(titlebooks, null, 4));
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({message: "There was an error retrieving the books."});
  })
})

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const reviews = [];
  for(book of Object.entries(books)) {
    if(book[0] === isbn) {
      const details = book[1];
      res.send(JSON.stringify(details['reviews'], null, 4))
    }
  }
});

module.exports.general = public_users;
