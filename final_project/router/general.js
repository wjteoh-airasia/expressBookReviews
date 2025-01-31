const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(200).json(books); // getting list of books available in shop
  new Promise((resolve, reject) => {
    resolve(books); // Resolving the promise with the list of books
  })
  .then((bookList) => res.status(200).json(bookList))
  .catch((err) => res.status(500).json({ error: "Error fetching books" }));
});

// Get book details based on ISBN
//public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //let isbnParams = req.params.isbn;
  //let book = books[isbnParams];
  
  // Check if the book exists
  //if (book) {
    // Book found, return book
   // return res.status(200).json(book);
 // } else {
    // book not found, send error message
  //  return res.status(404).json({ message: "Book not found" });
  //}
 //});

 // Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    let isbnParams = req.params.isbn;
  
    // Create a new promise
    const getBookByIsbn = new Promise((resolve, reject) => {
      // Check if the book exists in the books object
      let book = books[isbnParams];
  
      // If the book is found, resolve the promise
      if (book) {
        resolve(book);
      } else {
        // If the book is not found, reject the promise
        reject("Book not found");
      }
    });
  
    // Handle the promise
    getBookByIsbn
      .then((book) => {
        // Book is found, return it as response
        return res.status(200).json(book);
      })
      .catch((error) => {
        // Book not found, return error message
        return res.status(404).json({ message: error });
      });
  });  





// Get book details based on author
//public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //let authorName = req.params.author.toLowerCase();
  //let booksByAuthor = []; // filter books based on author names
  
  // Iterate through all books
  //for (let isbn in books) {
   // let book = books[isbn];

    // Check if the author matches
   // if (book.author.toLowerCase() === authorName) {
   //   booksByAuthor.push(book);  // If matches, add the book to the result array
  //  }
 // }

  // If books by the author are found, send them as response
  //if (booksByAuthor.length > 0) {
  //  return res.status(200).json(booksByAuthor);
  //} else {
  //  return res.status(404).json({ message: "No books found by this author" });
 // }
//});

// Get book details based on author using Promises
public_users.get('/author/:author',function (req, res) {
    let authorName = req.params.author.trim().toLowerCase(); // Handle extra spaces and case-insensitivity
    let booksByAuthor = []; // Array to store books by the specified author
  
    // Check if authorName is empty
    if (!authorName) {
      return res.status(400).json({ message: "Author name is required." });
    }
  
    // Create a new promise
    const getBooksByAuthor = new Promise((resolve, reject) => {
      // Iterate through all books and check the author's name
      for (let isbnKey in books) {
        let book = books[isbnKey];
  
        // If the book's author matches the requested author, add it to the results
        if (book.author.toLowerCase() === authorName) {
          booksByAuthor.push(book);
        }
      }
  
      // If books are found, resolve the promise, else reject with an error message
      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject("No books found by this author.");
      }
    });
  
    // Use the promise
    getBooksByAuthor
      .then((booksByAuthor) => {
        return res.status(200).json(booksByAuthor); // Return the books found by the author
      })
      .catch((error) => {
        return res.status(404).json({ message: error }); // Return error message if no books are found
      });
  });




// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
  //Write your code here
 // const titleParam = req.params.title.toLowerCase();
  //let bookFound = null;

  // Iterate through all books
  //for (let isbn in books) {
   // let book = books[isbn];

    // Check if book title matches
    //if (book.title.toLowerCase() == titleParam) {
     //   bookFound = book;
      //  break; // exit if book is found
    //}
 // }


  // If books by the title are found, send it as response
   // if (bookFound) {
    //  return res.status(200).json(bookFound);
   // } else {
    //  return res.status(404).json({ message: "No books found by this title." });
   // }  
 // });

// Get all books based on title using Promise
public_users.get('/title/:title', function (req, res) {
    const titleParam = req.params.title.toLowerCase();
  
    // Create a new promise to handle the search operation
    const findBookByTitle = new Promise((resolve, reject) => {
      let bookFound = null;
  
      // Iterate through all books
      for (let isbn in books) {
        let book = books[isbn];
  
        // Check if book title matches
        if (book.title.toLowerCase() === titleParam) {
          bookFound = book;
          break; // exit if book is found
        }
      }
  
      // Resolve if the book is found
      if (bookFound) {
        resolve(bookFound);
      } else {
        // Reject if no book is found
        reject("No books found by this title.");
      }
    });
  
    // Handle the promise
    findBookByTitle
      .then((book) => {
        // Book found, return it as response
        return res.status(200).json(book);
      })
      .catch((error) => {
        // No book found, return error message
        return res.status(404).json({ message: error });
      });
  });
  





//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  // If book exists, review is returned
  if (book) {
    return res.status(200).json(book.reviews);
  }
  return res.status(404).json({message: "Book Review not found"});
});

module.exports.general = public_users;
