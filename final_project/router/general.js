const express = require("express");
let books = require("./booksdb.js");
const { doesExist } = require("./auth_users.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    }
    return res.status(404).json({ message: "User already exists!" });
  }

  return res.status(404).json({ message: "Unable to register user." });
});

public_users.get("/", function (_, res) {
  res.send(books);
});

public_users.get("/isbn/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  if (book) return res.send(book);
  res.status(404).json({ message: "Book not found" });
});

public_users.get("/author/:author", function (req, res) {
  const filteredBooks = Object.values(books).filter(
    (book) => book.author.toLowerCase() === req.params.author.toLowerCase()
  );

  res.send(filteredBooks);
});

public_users.get("/title/:title", function (req, res) {
  const filteredBooks = Object.values(books).filter(
    (book) => book.title === req.params.title
  );

  res.send(filteredBooks);
});

public_users.get("/review/:isbn", function (req, res) {
  const book = books[req.params.isbn];
  if (book && book.reviews) {
    return res.send(book.reviews);
  }
  return res.status(404).json({ message: "Book or reviews not found" });
});

module.exports.general = public_users;
