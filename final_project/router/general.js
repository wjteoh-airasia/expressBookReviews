const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isUserExistent(username)) {
      users.push({"username": username, "password": password});
      return res.status(200).json({message: "User successfully registered!"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  
  return res.status(404).json({message: "Unable to register user, please provide an username and password."});

});

const isUserExistent = (username) => {
  let userswithsamename = isValid(username);
  return userswithsamename.length > 0;
}

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const api = await axios.get("url_api_here");
    const books = api.data;
    return res.send(200).json(books);
  } catch (error) {
    return res.status(500).json({"message": "There was an error fetching your request."});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbnParam = req.params.isbn;

  try {
    const response = await axios.get(`url_api_here/${isbnParam}`);
    const book = response.data;
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book details."});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const authorSearched = req.params.author;

  try {
    const response = await axios.get(`url_api_here/${authorSearched}`);
    const author = response.data;
    res.status(200).json(author);
  } catch (error) {
    res.status(500).json({ message: "Error fetching author details."});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const titleSearched = req.params.title;
  try {
      const response = await axios.get(`URL_TO_GET_BOOKS_BY_TITLE/${titleSearched}`);
      const title = response.data;
      res.status(200).json(title);
  } catch (error) {
      res.status(500).json({ message: "Error fetching books by title."});
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  const isbnParam = req.params.isbn;

  for (let id in books) {
    if (books[id].isbn === isbnParam) {
      return res.status(200).json(books[id].reviews);
    }
  }
});

module.exports.general = public_users;
