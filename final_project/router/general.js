const express = require("express");
const books = require("./booksdb.js");
const axios = require("axios");
const isValid = require("./auth_users.js").isValid;
const users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  //   console.log(username + password);

  if (!username || !password) {
    return res.status(400).json({
      message: "Invalid input! Username and password must be entered.",
    });
  }

  if (isValid(username)) {
    return res.status(400).json({ message: "Username already exists!" });
  }

  users.push({ username: username, password: password });
  return res
    .status(200)
    .json({ message: "User Successfully Registered. Now you can login." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get the book list available in the shop using async/await with axios
async function getBooksListWithAsyncAwait() {
  try {
    const res = await axios.get("http://localhost:5000/");
    console.log("List of Books: ", res.data);
  } catch (error) {
    console.log("Error, fetching failed!", error);
  }
}

// Call the function to fetch the books
getBooksListWithAsyncAwait();

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  return res.send(books[isbn]);
});

// Function to get book details based on ISBN using Promises
function getBookByISBNWithPromise(isbn) {
  axios
    .get(`http://localhost:5000/book/${isbn}`)
    .then((res) => {
      console.log(`Book details for ISBN ${isbn}:`, res.data);
    })
    .catch((error) => {
      console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
    });
}

// Call the function with the ISBN
getBookByISBNWithPromise(8);

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let authorName = req.params.author;
  let booksByAuthor = [];

  Object.keys(books).forEach((key) => {
    if (books[key].author.toLowerCase() === authorName.toLowerCase()) {
      booksByAuthor.push(books[key]);
    }
  });

  if (booksByAuthor.length > 0) {
    return res.status(200).json({ books: booksByAuthor });
  }
  return res
    .status(404)
    .json({ message: "No books found for the author: " + authorName });
});

// Function to get book details based on author using promises
function getBookByAuthorWithPromise(author) {
  axios
    .get(`http://localhost:5000/author/${author}`)
    .then((res) => {
      console.log(`Books by ${author}: `, res.data);
    })
    .catch((error) => {
      console.error(`Error fetching books by ${author}: `, error.message);
    });
}

// Call the function with the author's name
getBookByAuthorWithPromise("Chinua Acheba");

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  let bookTitle = req.params.title;
  let booksByTitle = [];

  Object.keys(books).forEach((key) => {
    if (books[key].title.toLowerCase() === bookTitle.toLowerCase()) {
      booksByTitle.push(books[key]);
    }
  });

  if (booksByTitle.length > 0) {
    return res.status(200).json({ books: booksByTitle });
  }
  return res
    .status(404)
    .json({ message: "No books found for the title: " + bookTitle });
});

// Function to get book details based on title using async-await
async function getBookByTitleWithAsyncAwait(title) {
  try {
    const res = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(`Books titled "${title}": `, res.data);
  } catch (error) {
    console.error(`Error fetching books titled "${title}": `, error.message);
  }
}

// Call the function with the book title
getBookByTitleWithAsyncAwait("Things Fall Apart");

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;

  if (books[isbn] && books[isbn].reviews.length > 0) {
    return res.status(200).json({ reviews: books[isbn].reviews });
  }
  return res
    .status(404)
    .json({ message: "No book reviews found for the book" });
});

module.exports.general = public_users;
