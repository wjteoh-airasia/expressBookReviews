const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  const userExists = (username) => {
    const getOne = users.filter(user => user.username === username)
    return getOne.length > 0
  }

  if (!userExists(username)){
    const newUser = {username,password}
    users = [...users, newUser]
    return res.status(201).json({message:"User created ",newUser})
  }
  return res.status(400).json({message:'User already taken.'})
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    // Simulate an async operation using a Promise
    const bookList = await new Promise((resolve, reject) => {
      // Simulating success
      resolve(books);
    });

    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving books', error });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    
    const book = await new Promise((resolve, reject) => {
      const foundBook = books[isbn];
      if (foundBook) {
        resolve(foundBook);
      } else {
        reject(new Error("Book not found"));
      }
    });

  
    return res.status(200).json(book);

  } catch (error) {
    
    return res.status(404).json({ message: error.message });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const value = req.params.author;

  new Promise((resolve, reject) => {
    let details = [];

   
    for (let key of Object.keys(books)) {
     
      if (books[key].author === value) {
        details.push(books[key]);
      }
    }

    
    if (details.length > 0) {
      resolve(details);  
    } else {
      reject(new Error("Books not found"));  
    }
  })
  .then((details) => {
 
    return res.status(200).json(details);
  })
  .catch((error) => {
    return res.status(404).json({ message: error.message });
  });
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  new Promise((resolve, reject) => {
    const matches = {};

    for (let key of Object.keys(books)) {
      if (books[key].title === title) {
        matches[key] = books[key];
      }
    }
    if (Object.keys(matches).length > 0) {
      resolve(matches)
    } else {
      reject(new Error("Books not found"));
    }
  })
  .then((matches) => {
    return res.status(200).json(matches);
  })
  .catch((error) => {
    return res.status(404).json({ message: error.message });
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book){
    return res.status(400).json({message:"Book not found"})
  }
  return res.status(200).json({reviews:book.reviews})
});

module.exports.general = public_users;
