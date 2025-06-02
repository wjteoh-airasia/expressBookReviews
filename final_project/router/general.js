const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to get book list using Promise
function getBooks(){
    return new Promise((resolve,reject)=>{
        resolve(books);
    })
}

// Function to get book by ISBN using Promise
function getByISBN(isbn){
    return new Promise((resolve,reject)=>{
        let book = books[isbn];
        if(book){
            resolve(book);
        }else{
            reject("Unable to find book!");
        }
    })
}

// Function to get book by Author using Promise
function getByAuthor(author){
    return new Promise((resolve,reject)=>{
        let output = [];
        for (let isbn in books) {
            let book = books[isbn];
            if (book.author === author){
                output.push({"isbn":isbn,
                             "title":book.title,
                             "reviews":book.reviews});
            }
        }
        if(output.length > 0){
            resolve(output);
        }else{
            reject("Unable to find books by this author!");
        }
    })
}

// Function to get book by Title using Promise
function getByTitle(title){
    return new Promise((resolve,reject)=>{
        let output = [];
        for (let isbn in books) {
            let book = books[isbn];
            if (book.title === title){
                output.push({"isbn":isbn,
                             "author":book.author,
                             "reviews":book.reviews});
            }
        }
        if(output.length > 0){
            resolve(output);
        }else{
            reject("Unable to find books with this title!");
        }
    })
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop using async callback
public_users.get('/',function (req, res) {
    // Using async callback pattern
    setTimeout(() => {
        res.send(JSON.stringify(books,null,4));
    }, 1000);
});

// Get book details based on ISBN using Promise
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getByISBN(isbn)
    .then(result => res.send(result))
    .catch(err => res.status(404).json({message: err}));
 });
  
// Get book details based on author using Promise
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getByAuthor(author)
    .then(result => res.send(result))
    .catch(err => res.status(404).json({message: err}));
});

// Get all books based on title using Promise
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getByTitle(title)
    .then(result => res.send(result))
    .catch(err => res.status(404).json({message: err}));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let book = books[isbn];
    if(book){
        res.send(book.reviews);
    }
    else{
        res.status(404).json({message: "Unable to find book!"});
    }
});

// Task 10: Get all books using async-await with Axios
public_users.get('/async/books', async function (req, res) {
    try {
        // Simulate external API call using axios (self-call for demonstration)
        const response = await axios.get('http://localhost:5000/');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({message: "Error fetching books", error: error.message});
    }
});

// Task 11: Get book details based on ISBN using async-await with Axios
public_users.get('/async/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        // Using promise-based approach with axios for external API simulation
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
        res.send(response.data);
    } catch (error) {
        res.status(404).json({message: "Unable to find book!", error: error.message});
    }
});

// Task 12: Get book details based on Author using async-await with Axios
public_users.get('/async/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        // Using promise-based approach with axios
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        res.send(response.data);
    } catch (error) {
        res.status(404).json({message: "Unable to find books by this author!", error: error.message});
    }
});

// Task 13: Get book details based on Title using async-await with Axios
public_users.get('/async/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        // Using promise-based approach with axios
        const response = await axios.get(`http://localhost:5000/title/${title}`);
        res.send(response.data);
    } catch (error) {
        res.status(404).json({message: "Unable to find books with this title!", error: error.message});
    }
});

module.exports.general = public_users;
