const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if(username&&password)
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
}
    users.push({ username, password });
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});
public_users.get('/promise/books', function (req, res) {
    axios.get('http://localhost:5001/') // 请求书籍列表的 API 地址
        .then(response => {
            res.status(200).json(response.data); // 成功返回书籍数据
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching books", error });
        });
});
// Promise 方式获取书籍详情（基于 ISBN）
public_users.get('/promise/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn;
    axios.get(`http://localhost:5001/isbn/${isbn}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching book by ISBN", error });
        });
});
public_users.get('/promise/author/:author', function (req, res) {
    let author = req.params.author;
    axios.get(`http://localhost:5001/author/${author}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching book by author", error });
        });
});
public_users.get('/promise/title/:title', function (req, res) {
    let title = req.params.title;
    axios.get(`http://localhost:5001/title/${title}`)
        .then(response => {
            res.status(200).json(response.data);
        })
        .catch(error => {
            res.status(500).json({ message: "Error fetching book by title", error });
        });
});

public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = req.params.isbn; // 
    const book = books[isbn]; 
    if (book) {
        return res.status(200).json(book);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  const filteredBooks = Object.values(books).filter(book => book.author === author);
    return res.status(200).json(filteredBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  const filteredBooks = Object.values(books).filter(book => book.title === title);
    return res.status(200).json(filteredBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        return res.status(200).json(book.reviews);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

module.exports.general = public_users;
