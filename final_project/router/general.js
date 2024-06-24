const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if(username && password){
    const filteredUsers = users.filter(user => user.username === username)
    if(filteredUsers.length > 0)
    res.send('Username already exists')
    else {users.push({ username, password}); res.send('User ' + username + ' successfully added')}
  }
  else res.send('Invalid username or password') 
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  return await res.send(JSON.stringify(books, ' ',4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  return await res.send(JSON.stringify(books[req.params.isbn], ' ',4))
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author
  const filteredBooks = []
  Object.keys(books).forEach((key)=> {if(books[key].author === author) filteredBooks.push(books[key])})
  return await res.send(JSON.stringify(filteredBooks, ' ',4))
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    const title = req.params.title
    const filteredBooks = []
    Object.keys(books).forEach((key)=> {if(books[key].title === title) filteredBooks.push(books[key])})
    return await res.send(JSON.stringify(filteredBooks, ' ',4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books[req.params.isbn], ' ', 4))
});

module.exports.general = public_users;
