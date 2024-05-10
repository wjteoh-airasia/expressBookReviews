const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ "username":"test1","password":"test2"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

  const found_user = users.filter(( user ) => {return user.username === username && user.password === password} );
  if (found_user.length > 0) return true;
  else return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
    
  if (!req.body.username && !req.body.password) return res.status(400).json({message: "username and password required"});
  if (!req.body.username) return res.status(400).json({message: "username required"});
  if (!req.body.password) return res.status(400).json({message: "password required"});
  
  const username = req.body.username;
  const password = req.body.password;
  if (!authenticatedUser(username,password)) return res.status(404).send({message: "Failed to login"});
  
  const accessToken = jwt.sign({ password: password }, 'access');
  req.session.authorization = {accessToken,username}

  return res.status(200).send({message: "Customer successful logged in"});
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  
  const review = req.query.review;
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
 
  //const current_user = req.session.authenticated.username;
  books[isbn].reviews[username] = review;
  
  return res.status(400).json({message: "The review for the book with ISBN " + isbn + " has been added/updated."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  
  const review = req.query.review;
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
 
  //const current_user = req.session.authenticated.username;
  delete books[isbn].reviews[username];
  
  return res.status(400).json({message: "Review for the ISBN " + isbn + " posted by the user" + username + " deleted."});
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
