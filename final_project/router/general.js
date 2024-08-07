const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
const axios = require("axios"); // Import Axios
let users = require("./auth_users.js").users;
const public_users = express.Router();
const bodyParser = require("body-parser");

// Use bodyParser middleware to parse JSON bodies
public_users.use(bodyParser.json());

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Add new user to the user storage
  users.push({ username, password });
  return res.status(300).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.status(300).json(JSON.stringify(books));
});

// Get book list using async-await (simulated async operation)
public_users.get("/books_async", async function (req, res) {
  try {
    // Simulate an async operation using a promise
    const fetchBooks = async () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(books);
        }, 1000);
      });
    };

    const booksList = await fetchBooks();
    res.status(200).json(booksList);
  } catch (error) {
    res.status(500).json({ message: "Error fetching book list" });
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    return res.status(300).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on ISBN using async-await with Axios
public_users.get("/isbn_async/:isbn", async function (req, res) {
  const { isbn } = req.params;

  try {
    // Simulate an async operation using a promise
    const fetchBook = async (isbn) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const book = books[isbn];
          if (book) {
            resolve(book);
          } else {
            reject("Book not found");
          }
        }, 1000); // Simulate async delay
      });
    };

    const book = await fetchBook(isbn);
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author.toLocaleLowerCase() === author.toLocaleLowerCase()
  );
  if (booksByAuthor.length > 0) {
    return res.status(300).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

// Get book details based on author using async-await with Axios
public_users.get("/author_async/:author", async function (req, res) {
  const { author } = req.params;

  try {
    // Simulate an async operation using a promise
    const fetchBooksByAuthor = async (author) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const booksByAuthor = Object.values(books).filter(
            (book) =>
              book.author.toLocaleLowerCase() === author.toLocaleLowerCase()
          );
          if (booksByAuthor.length > 0) {
            resolve(booksByAuthor);
          } else {
            reject("No books found for this author");
          }
        }, 1000); // Simulate async delay
      });
    };

    const booksByAuthor = await fetchBooksByAuthor(author);
    res.status(200).json(booksByAuthor);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const { title } = req.params;
  const booksBytitle = Object.values(books).filter(
    (book) => book.title.toLocaleLowerCase() === title.toLocaleLowerCase()
  );
  if (booksBytitle.length > 0) {
    return res.status(300).json(booksBytitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book details based on title using async-await with Axios
public_users.get("/title_async/:title", async function (req, res) {
  const { title } = req.params;

  try {
    // Simulate an async operation using a promise
    const fetchBooksByTitle = async (title) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const booksByTitle = Object.values(books).filter(
            (book) =>
              book.title.toLocaleLowerCase() === title.toLocaleLowerCase()
          );
          if (booksByTitle.length > 0) {
            resolve(booksByTitle);
          } else {
            reject("No books found with this title");
          }
        }, 1000); // Simulate async delay
      });
    };

    const booksByTitle = await fetchBooksByTitle(title);
    res.status(200).json(booksByTitle);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params; // Extract ISBN from URL parameters
  // Find the book by ISBN
  const book = books[isbn];

  if (book) {
    return res.status(200).json(book.reviews); // Return the reviews for the book
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
