const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
  try{
    const getBooksAsync = () => {
      return new promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        },100);
      });
    });
    
  const allBooks = awit getBooksAsync();
  return res.status(200).send(JSON.stringify(allBooks, null, 4));
  }catch(err){
    return res.status(500).json({message: "Failed to retrieve books."});
  }
    
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.parms.isbn;

  const getBookByISBN = (isbn) => {
    return new promise((resolve, reject) => {
      const book = books[isbn]
      if(book) {
        resolve(book);
      }else{
        reject("Book not found");
      }
    });
  };

  try{
    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
  }catch(error){
    return res.status(404).json({ message: error });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;

  const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found by this author");
      }
    });
  };

  try {
    const booksByAuthor = await getBooksByAuthor(author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
