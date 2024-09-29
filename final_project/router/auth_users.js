const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const { message } = require('prompt');
const regd_users = express.Router();

let users = [
  {
    "username":"Mathias",
    "password":"def__init__2002018"
  },
  {
    "username":"Mathia",
    "password":"def__init__2002018"
  }
];

const isValid = (username)=>{ //returns boolean
    return users.filter(user => user.username === username).length > 0;
  
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.filter(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username  = req.body.username;
  const password = req.body.password
  if (!isValid(username)){
    return res.status(400).json({message:"User not registered."})
  }
  if (!authenticatedUser(username, password)){
    return res.status(400).json({message:"Bad creds"})
  }
  const jwtToken = jwt.sign({username},'authentication',{expiresIn:60*1000});
  req.session.authorization = {jwtToken}
  return res.status(200).json({message:"You are now logged in"})
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const user = req.user;
  let book = books[isbn];
  const review = req.query.review
  book.reviews[user.username] = {message:review}
  books = {...books, book}
  return res.status(201).json(book)
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
