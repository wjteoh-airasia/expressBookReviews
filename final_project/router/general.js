const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
const username = req.body.username;
const password = req.body.password;

  if (username && password) {
    if (isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});
function retrieveBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  retrieveBooks().then(
    (books) => res.status(200).send(JSON.stringify(books, null, 4)),
    (error) =>
      res
        .status(404)
        .send("An error has occured trying to retrieve all the books")
  );
});
function retrieveBookFromISBN(isbn) {
  let book = books[isbn];
  return new Promise((resolve, reject) => {
    if (book) {
      resolve(book);
    } else {
      reject(new Error("The provided book does not exist"));
    }
  });
}
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   const isbn = req.params.isbn;
  retrieveBookFromISBN(isbn).then(
    (book) => res.status(200).send(JSON.stringify(book, null, 4)),
    (err) => res.status(404).send(err.message)
  );
 });
  function retrieveBookFromAuthor(author) {
  let validBooks = [];
  return new Promise((resolve, reject) => {
    for (let bookISBN in books) {
      const bookAuthor = books[bookISBN].author;
      if (bookAuthor === author) {
        validBooks.push(books[bookISBN]);
      }
    }
    if (validBooks.length > 0) {
      resolve(validBooks);
    } else {
      reject(new Error("The provided author does not exist"));
    }
  });
}
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  retrieveBookFromAuthor(author).then(
    (books) => res.status(200).send(JSON.stringify(books, null, 4)),
    (err) => res.status(404).send(err.message)
  );
});
function retrieveBookFromTitle(title) {
  let validBooks = [];
  return new Promise((resolve, reject) => {
    for (let bookISBN in books) {
      const bookTitle = books[bookISBN].title;
      if (bookTitle === title) {
        validBooks.push(books[bookISBN]);
      }
    }
    if (validBooks.length > 0) {
      resolve(validBooks);
    } else {
      reject(new Error("The provided book title does not exist"));
    }
  });
}
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  retrieveBookFromTitle(title).then(
    (book) => res.status(200).send(JSON.stringify(book, null, 4)),
    (err) => res.status(404).send(err.message)
  );
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn;
  if (books[isbn] !== null) {
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Provided book does not exist" });
  }
});

module.exports.general = public_users;
