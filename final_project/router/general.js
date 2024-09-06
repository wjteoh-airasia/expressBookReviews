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
public_users.get('/',function (req, res) {
  const getBooks = () => {
        return new Promise((resolve, reject) => {
          try {
            // Resolve the Promise with the books data
            resolve(books);
          } catch (error) {
            // Reject the Promise if there's an error
            reject(error);
          }
        });
      };
    
      // Use the Promise to fetch books
      getBooks()
        .then((books) => {
          // Send the books data as a JSON response
          return res.status(200).send(JSON.stringify(books, null, 4));
        })
        .catch((error) => {
          // Handle errors by sending an error response
          return res.status(500).json({ message: "Error fetching books", error });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Create a Promise to fetch the book details by ISBN
  const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
      const book = books[isbn]; // Find the book by ISBN
      if (book) {
        resolve(book); // Resolve the Promise with the book data
      } else {
        reject("Book not found"); // Reject the Promise if the book is not found
      }
    });
  };

  const isbn = req.params.isbn;

  // Use the Promise to fetch the book by ISBN
  getBookByISBN(isbn)
    .then((book) => {
      return res.status(200).json(book); // Send the book data in the response
    })
    .catch((error) => {
      return res.status(404).json({ message: error }); // Send error message if book not found
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Create a Promise to search for books by the author
  const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);
      
      // If books are found, resolve the Promise with the books data
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        // Reject the Promise if no books are found
        reject("No books found by this author");
      }
    });
  };

  const author = req.params.author;

  // Use the Promise to fetch books by the author
  getBooksByAuthor(author)
    .then((books) => {
      return res.status(200).json(books); // Send the books data in the response
    })
    .catch((error) => {
      return res.status(404).json({ message: error }); // Send error message if no books found
    });
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
