const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  
  if (!req.body.username && !req.body.password) return res.status(404).json({message: "username and password required"});
  if (!req.body.username) return res.status(404).json({message: "username required"});
  if (!req.body.password) return res.status(404).json({message: "password required"});
  
  const in_username = req.body.username;
  const in_password = req.body.password;

  if(users.find(({ username }) => username === in_username)) return res.status(404).json({ message: "Username already exists" });
  
  users.push({ "username":in_username, "password":in_password });
  return res.status(201).json({message: "Customer successfully registered. Now you can login"});
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.json(books);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const in_isbn = req.params.isbn;
  if (books[in_isbn]) res.json(books[in_isbn]);
  else return res.status(404).json({message: "isbn: "+in_isbn+" not found"});
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const in_author = req.params.author;
  let out_books = [];
  
  for (book in books) if (books[book].author == in_author) {
      let push_book = {"isbn":book};
      for (key in books[book]) push_book[key] = books[book][key];
      delete push_book.author;
      out_books.push(push_book);
  }
  if (out_books.length > 0)  res.send(out_books);
  else return res.status(404).json({message: "Books with author: "+in_author+" not found"});
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const in_title = req.params.title;
  let out_books = [];
  
  for (book in books) if (books[book].title == in_title) {
      let push_book = {"isbn":book};
      for (key in books[book]) push_book[key] = books[book][key];
      delete push_book.title;
      out_books.push(push_book);
  }
  if (out_books.length > 0)  res.send(out_books);
  else return res.status(404).json({message: "Books with title: "+in_title+" not found"});
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const in_isbn = req.params.isbn;
  if (books[in_isbn]) res.send(JSON.stringify(books[in_isbn].reviews));
  else return res.status(404).json({message: "isbn: "+in_isbn+" not found"});
  //return res.status(300).json({message: "Yet to be implemented"});
});
/*
public_users.get('/task10',async function(req,res){
  axios.get('http://localhost:5000/')
  .then(function(response){
    return res.status(200).json(response.data);
  });
});

public_users.get('/task11/:isbn',async function(req,res){
  const in_isbn = req.params.isbn;
  axios.get('http://localhost:5000/isbn/'+in_isbn)
  .then(function(response){
    return res.status(200).json(response.data);
  });
});

public_users.get('/task12/:author',async function(req,res){
  const in_author = req.params.author;
  axios.get('http://localhost:5000/author/'+in_author)
  .then(function(response){
    return res.status(200).json(response.data);
  });
});

public_users.get('/task13/:title',async function(req,res){
  const in_title = req.params.title;
  axios.get('http://localhost:5000/title/'+in_title)
  .then(function(response){
    return res.status(200).json(response.data);
  });
});
*/
module.exports.general = public_users;
    