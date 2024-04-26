const express = require('express');
let books = require("./booksdb.js");
const e = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// User Registration Endpoint
public_users.post("/register", (req,res) => {
  //Write your code here
  // Checks if user already exists.
  // Checks if username and password are not null.
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(403).json({message: "Unable to register user with provided credentials."});
});

// Synchronous controller function to handle all book get requests
let getFromBooks = (req) => {
  let result = {};
  const { isbn, author, title } = req.params;
  if( isbn != null ) {
    // handle /isbn/:isbn
    result = books[isbn];
  } else if(author != null) {
    // handle /author/:author
    for (const [key, value] of Object.entries(books)) {
      if(value.author === author)
        result[key] = value;
    }
  } else if(title != null) {
    // handle /title/:title
    for (const [key, value] of Object.entries(books)) {
      if(value.title === title)
        result[key] = value;
    }
  } else {
    Object.assign(result, books);
  }
  // return the result
  return result;
};

let getReviews = (req) => {
  let result = {};
  const {isbn} = req.params;
  if( isbn != null ) {
    books[isbn].reviews;
  }
  return result;
};

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
  //Write your code here
  // if error checking is required, check for null result from getFromBooks()
  res.send(JSON.stringify(await getFromBooks(req),null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  //Write your code here
  let result = {};
  const promise = new Promise((resolve, reject) => {
    result = getFromBooks(req);
    if( Object.keys(result).length === 0 && result.constructor === Object ) {
      reject("Promise is fulfilled!");
    } else {
      resolve("Promise is resolved.");
    }
  });

  promise
    .then( (promiseResolveMessage) => { console.log(promiseResolveMessage); res.send(JSON.stringify( result,null,4)); },
           (promiseRejectMessage) => { console.log(promiseRejectMessage); return res.status(400).json({message: `ISBN: ${req.params.isbn} not found.`}); }
    );
  
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  //Write your code here
  // if error checking is required, check for null result from getFromBooks()
  res.send(JSON.stringify(await getFromBooks(req),null,4));
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  //Write your code here
  // if error checking is required, check for null result from getFromBooks()
  res.send(JSON.stringify(await getFromBooks(req),null,4));
});

//  Get book review
public_users.get('/review/:isbn',async (req, res) => {
  //Write your code here
  // if error checking is required, check for null result from getReviews()
  res.send(JSON.stringify(await getReviews(req),null,4));
});

module.exports.general = public_users;
