const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required." });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists." });
    } else {
        users.push({ username, password });
        return res.status(201).json({ message: "User registered successfully!" });
    }
});

public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});


public_users.get('/isbn/:isbn', function (req, res) {
    const { isbn } = req.params;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

public_users.get('/author/:author', function (req, res) {
    const authorBooks = Object.values(books).filter(book => book.author === req.params.author);
    if (authorBooks.length > 0) {
        return res.status(200).json(authorBooks);
    } else {
        return res.status(404).json({ message: "Books by this author not found." });
    }
});

public_users.get('/title/:title', function (req, res) {
    const titleBooks = Object.values(books).filter(book => book.title === req.params.title);
    if (titleBooks.length > 0) {
        return res.status(200).json(titleBooks);
    } else {
        return res.status(404).json({ message: "Books with this title not found." });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  
  if (book) {
      return res.status(200).json({ reviews: book.reviews });
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get('/books/async', async (req, res) => {
  try {
      const getBooks = async () => {
          return new Promise((resolve) => {
              setTimeout(() => {
                  resolve(books);
              }, 1000); // Simulating async operation
          });
      };

      const allBooks = await getBooks();
      return res.status(200).json(allBooks);
  } catch (error) {
      return res.status(500).json({ message: "An error occurred while fetching books." });
  }
});

public_users.get('/books/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  const findBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn]) {
          resolve(books[isbn]);
      } else {
          reject("Book not found");
      }
  });

  findBookByISBN
      .then(book => {
          return res.status(200).json(book);
      })
      .catch(error => {
          return res.status(404).json({ message: error });
      });
});

public_users.get('/books/author/:author', (req, res) => {
  const author = req.params.author;

  const findBooksByAuthor = new Promise((resolve, reject) => {
      const booksByAuthor = Object.values(books).filter(book => book.author === author);

      if (booksByAuthor.length > 0) {
          resolve(booksByAuthor);
      } else {
          reject("No books found for this author");
      }
  });

  findBooksByAuthor
      .then(books => {
          return res.status(200).json(books);
      })
      .catch(error => {
          return res.status(404).json({ message: error });
      });
});


public_users.get('/books/title/:title', (req, res) => {
  const title = req.params.title;

  const findBookByTitle = new Promise((resolve, reject) => {
      const book = Object.values(books).find(book => book.title === title);

      if (book) {
          resolve(book);
      } else {
          reject("No book found with this title");
      }
  });

  findBookByTitle
      .then(book => {
          return res.status(200).json(book);
      })
      .catch(error => {
          return res.status(404).json({ message: error });
      });
});



module.exports.general = public_users;
