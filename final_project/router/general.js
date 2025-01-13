const express = require('express');
const axios = require('axios')
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  console.log("Checking if user exists:", username); // Debugging statement

  for (let i = 0; i < users.length; i++) {
    console.log("Checking against user:", users[i].username); // Debugging

    if (users[i].username === username) {
      return true;
    }
  }

  return false;
};


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username, password });
      console.log("New user registered:", users);
      return res.status(200).json({ message: "User successfully registered. You are eligible for login!" });
    } else {
      return res.status(409).json({ message: "User already exists!" });
    }
  }

  return res.status(400).json({ message: "Invalid username or password. Please try again." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const bookList = await new Promise((resolve, reject) => {
      if (books) {
        resolve(books);
      } else {
        reject(new Error("Books data not available."));
      }
    });

    res.status(200).json(bookList);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Error fetching books", error: error.message});
  };
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  try {
    const response = await.get('https://tgilly93-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');

    const bookDetails = books[isbn];

    if (bookDetails) {
      return res.status(200).json(bookDetails);
    } else {
      res.status(404).json({ message: `book with ISBN: ${isbn} not found!`});
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message:'Error fetching book details.', error: error.message });
    
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const authorName = req.params.author;
  const bookDetails = [];

  try {
    const response = await axios.get('https://tgilly93-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');

    for (let id in books) {
      if (books[id].author.toLowerCase() === authorName.toLowerCase()) {
        bookDetails.push({
          isbn: books[id].isbn,
          author: books[id].author,
          title: books[id].title,
          reviews: books[id].reviews
        });
      }
    }

    if (bookDetails.length > 0) {
      res.status(200).json(bookDetails);
    } else {
      res.status(404).json({ message: `No books found by author: ${authorName}`});
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books by author.', error: error.message })
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const bookTitle = req.params.title;
  const bookDetails = [];

  try {
    const response = await axios.get('https://tgilly93-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/');

    for (let id in books) {
      if (books[id].title.toLowerCase() === bookTitle.toLowerCase()) {
        bookDetails.push({
          isbn: books[id].isbn,
          author: books[id].author,
          title: books[id].title,
          reviews: books[id].reviews
        });
      }
    }

    if (bookDetails.length > 0) {
      res.status(200).json(bookDetails);
    } else {
      res.status(404).json({ message: `No books with title: ${bookTitle}`});
    }
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books by title.', error: error.message });
    
  }

  

  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  if (books[isbn]) {
    const reviews = books[isbn].reviews;
    return res.status(200).json(reviews);
  } else {
    return res.status(404).json({ message: `No reviews found with ISBN: ${isbn}`})
  }
});

module.exports.general = public_users;
