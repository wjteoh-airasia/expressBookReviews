const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
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

// Helper function to simulate an asynchronous API call
const getBooksAsync = () => {
    return new Promise((resolve, reject) => {
        // We wrap the synchronous data access in a Promise
        // to simulate a real-world async operation like a database query.
        if (books) {
            resolve(books);
        } else {
            reject("Book data could not be found.");
        }
    });
};

// Get the book list available in the shop (using async-await)
public_users.get('/', async (req, res) => {
    try {
        const bookList = await getBooksAsync(); // Wait for the promise to resolve
        res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        console.error("Error fetching book list:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Simulates fetching a single book by ISBN
const getBookByIsbnAsync = (isbn) => {
    return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book); // Found the book
        } else {
            reject("Book not found"); // Did not find the book
        }
    });
};

// Get book details based on ISBN (Async)
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;
    try {
        const book = await getBookByIsbnAsync(isbn); // Wait for the promise to resolve
        res.status(200).json(book);
    } catch (error) {
        // This will catch the 'reject' from the promise
        res.status(404).json({ message: error });
    }
});

const getBooksByAuthorAsync = (author) => new Promise((resolve, reject) => {
    const authorBooks = [];
    for (const key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            authorBooks.push(books[key]);
        }
    }
    if (authorBooks.length > 0) {
        resolve(authorBooks); // Found books by the author
    } else {
        reject("No books found by that author"); // Did not find any
    }
});

// Get book details based on author (Async)
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
    try {
        const matchingBooks = await getBooksByAuthorAsync(author);
        res.status(200).json(matchingBooks);
    } catch (error) {
        // This catches the 'reject' from the promise
        res.status(404).json({ message: error });
    }
});

const getBooksByTitleAsync = (title) => new Promise((resolve, reject) => {
    const titleBooks = [];
    for (const key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            titleBooks.push(books[key]);
        }
    }
    if (titleBooks.length > 0) {
        resolve(titleBooks); // Found books with the matching title
    } else {
        reject("No books found with that title"); // Did not find any
    }
});

// Get all books based on title (Async)
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const matchingBooks = await getBooksByTitleAsync(title);
        res.status(200).json(matchingBooks);
    } catch (error) {
        // This catches the 'reject' from the promise
        res.status(404).json({ message: error });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    try {
      return res.send(books[isbn].reviews);
    } catch (error) {
      console.error("An error occurred while filtering:", error.message);
      // Return an empty object or null to indicate failure gracefully.
      return {};
    }
});

module.exports.general = public_users;
