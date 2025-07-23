const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// -----------------------------
// 📚 Task 10: Get all books
// -----------------------------

// Async/Await version
const getAllBooksAsync = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("Task 10 (Async) - All Books:\n", response.data);
  } catch (error) {
    console.error("Error in Task 10 (Async):", error.message);
  }
};

// Promise version
const getAllBooksPromise = () => {
  axios.get('http://localhost:5000/')
    .then(response => {
      console.log("Task 10 (Promise) - All Books:\n", response.data);
    })
    .catch(error => {
      console.error("Error in Task 10 (Promise):", error.message);
    });
};

// -----------------------------
// 📘 Task 11: Get book by ISBN
// -----------------------------

// Async/Await version
const getBookByISBNAsync = async (isbn) => {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log(`Task 11 (Async) - Book with ISBN ${isbn}:\n`, response.data);
  } catch (error) {
    console.error("Error in Task 11 (Async):", error.message);
  }
};

// Promise version
const getBookByISBNPromise = (isbn) => {
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(response => {
      console.log(`Task 11 (Promise) - Book with ISBN ${isbn}:\n`, response.data);
    })
    .catch(error => {
      console.error("Error in Task 11 (Promise):", error.message);
    });
};

// -----------------------------
// 🧑‍💼 Task 12: Get book by Author
// -----------------------------

// Async/Await version
const getBooksByAuthorAsync = async (author) => {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(`Task 12 (Async) - Books by author "${author}":\n`, response.data);
  } catch (error) {
    console.error("Error in Task 12 (Async):", error.message);
  }
};

// Promise version
const getBooksByAuthorPromise = (author) => {
  axios.get(`http://localhost:5000/author/${author}`)
    .then(response => {
      console.log(`Task 12 (Promise) - Books by author "${author}":\n`, response.data);
    })
    .catch(error => {
      console.error("Error in Task 12 (Promise):", error.message);
    });
};

// -----------------------------
// 📖 Task 13: Get book by Title
// -----------------------------

// Async/Await version
const getBooksByTitleAsync = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(`Task 13 (Async) - Books with title "${title}":\n`, response.data);
  } catch (error) {
    console.error("Error in Task 13 (Async):", error.message);
  }
};

// Promise version
const getBooksByTitlePromise = (title) => {
  axios.get(`http://localhost:5000/title/${title}`)
    .then(response => {
      console.log(`Task 13 (Promise) - Books with title "${title}":\n`, response.data);
    })
    .catch(error => {
      console.error("Error in Task 13 (Promise):", error.message);
    });
};





public_users.post("/register", (req,res) => {
  //Write your code here
   const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });;
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(users);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;
    // Filter the users array to find users whose lastName matches the extracted lastName parameter
    let filtered_isbn = users.filter((user) => user.isbn === isbn);
    // Send the filtered_lastname array as the response to the client
    res.send(filtered_isbn);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
    // Filter the users array to find users whose lastName matches the extracted lastName parameter
    let filtered_author = users.filter((user) => user.author === author);
    // Send the filtered_lastname array as the response to the client
    res.send(filtered_author);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
   const title = req.params.title;
    // Filter the users array to find users whose lastName matches the extracted lastName parameter
    let filtered_title = users.filter((user) => user.title === title);
    // Send the filtered_lastname array as the response to the client
    res.send(filtered_title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
 
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.status(200).json({ reviews: book.reviews });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
