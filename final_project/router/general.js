const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  try {
    const {username , password} = req.body;
  if (!username.trim() || !password.trim()) {
    return res.status(300).json({message : "username or password is empty"});
  }
  if(isValid(username)) {
    return res.status(300).json({message : "user already exist, please login"});
  }
  users.push({uname:username,ups:password});
  return res.status(200).json({message : "user added successfuly"}); 

  } catch (err) {
    return res.status(500).json({message : "servr error", err});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(200).json(books);

  const prettyBooks = JSON.stringify(Object.values(books).map(book => book.title), null, 2); // 2-space indentation for pretty output
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).send(prettyBooks);
  
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn in books) {
      return res.status(200).json({book :books[isbn]});
  }
  return res.status(404).json({message : "invalid isbn"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let obs = {};
  for(let key in books) {
    if(books[key].author === author) {
        obs[key] = books[key];
    }
  }
  if(Object.keys(obs).length > 0) {
    return res.status(200).json({books :obs});
  }

  return res.status(400).json({message: `no books are found from author ${author}`});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const ti = req.params.title;
  for(let key in books) {
    if(books[key].title === ti) {
        return res.status(200).json({book : books[key]});
    }
  }

  return res.status(400).json({message: `no book found matching the title ${ti}`});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if(isbn in books) {
    return res.status(200).json({ reviews :books[isbn].reviews});
  } 
  return res.status(400).json({message: "invalid isbn"});
});

module.exports.general = public_users;
