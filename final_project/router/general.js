import express from 'express';
//let isValid = require("./auth_users.js").isValid;
//let users = require("./auth_users.js").users;
import * as booksController from "../controller/booksController.js";

const public_users = express.Router();




// Get the book list available in the shop
public_users.get('/',booksController.getAllBooks);

// Get book details based on ISBN
public_users.get('/isbn/:isbn',booksController.getBooksIsbn);
  
// Get book details based on author
public_users.get('/author/:author',booksController.getBoooksbyAuthor);

// Get all books based on title
public_users.get('/title/:title',booksController.getBooksbyTitle);

//  Get book review
public_users.get('/review/:isbn',booksController.getReviewbyisbn);

export default public_users;
