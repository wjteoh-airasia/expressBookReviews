const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_user.post("/register", (req,res) =>{
  const {username, password} = req.body;

  if(!username || !password){
    return res.status(400).json({message: "username and password are required"});
  }
  const userExists = user.some(user => user.username === username);
  if(userExists){
    return res.status(409).json({message: "User already exists"});
  }
  user.push({username, password});
  return res.status(200).json({messsage: "user registerd successfulluy"});
}
)};

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = book[isbn];
  if(book && book.reviews){
    return res.status(200).json(book.reviews);
  }else{
    return res.status(404).json({message: "Noreviews found for this book"});
  }
});

module.exports.general = public_users;
