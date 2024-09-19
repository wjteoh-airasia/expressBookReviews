const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({
        message: `${username} successfully registered. Now you can login  `,
      });
    } else {
      return res.status(404).json({ message: `${username} already exists!` });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop

public_users.get("/", function (req, res) {
  //Write your code here
  // res.send(JSON.stringify(books, null, '\n'));

  //Using promise
  const allBookList = new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Book not found");
    }
  });
  allBookList
    .then((dtl) => {
      res.status(200).send(JSON.stringify(dtl, null, 4));
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

// Get book details based on ISBN

public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const book_isbn = req.params.isbn;
  // res.send(books[book_isbn]);
  // Using Promise
  function getBookDetails(isbn) {
    return new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Not Found Book");
      }
    });
  }
  getBookDetails(book_isbn)
    .then((dtl) => {
      res.status(200).send(dtl);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

// Get book details based on author

public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const book_author = req.params.author;
  // const bookArr = Object.values(books);
  // const book_details = bookArr.filter((book) => book.author == book_author).map((book) => book);
  // res.status(200).send(book_details);

  // Using promise
  function getBookDetails(author_name) {
    return new Promise((resolve, reject) => {
      let foundBook = null;
      for (let key in books) {
        if (books[key].author === author_name) {
          foundBook = books[key];
          break;
        }
      }
      if (foundBook) {
        resolve(foundBook);
      } else {
        reject("Book Not Found");
      }
    });
  }
  getBookDetails(book_author)
    .then((dtl) => {
      res.status(200).send(dtl);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

// Get all books based on title

public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const book_title = req.params.title;
  // const bookArr = Object.values(books);
  // const book_details = bookArr.filter((book) => book.title == book_title).map((book) => book);
  // res.send(book_details);

  //Using Promise
  function getBookDetails(titleOfBook) {
    return new Promise((resolve, reject) => {
      let foundBook = null;
      for (let key in books) {
        if (books[key].title === titleOfBook) {
          foundBook = books[key];
          break;
        }
      }
      if (foundBook) {
        resolve(foundBook);
      } else {
        reject("Book Not Found");
      }
    });
  }
  getBookDetails(book_title)
    .then((dtl) => {
      res.status(200).send(dtl);
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});

//  Get book review

public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  const book_rev = book.reviews;
  res.send(book_rev);
});

module.exports.general = public_users;
