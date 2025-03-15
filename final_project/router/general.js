const express = require("express");
const bodyParser = require("body-parser");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.status(200).send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbnID = req.params.isbn;

  if (books[isbnID]) {
    return res.status(200).send(JSON.stringify(books[isbnID]));
  } else {
    return res
      .status(404)
      .send(JSON.stringify({ message: "there is no book for this code" }));
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLocaleLowerCase();
  const bookByAuthor = {};

  for (const [ID, bookObj] of Object.entries(books)) {
    let book_author = bookObj.author.toLocaleLowerCase();
    let first_name_book_author = bookObj.author
      .split(" ")
      .at(0)
      .toLocaleLowerCase();

    if (book_author === author || first_name_book_author === author) {
      bookByAuthor[ID] = bookObj;
    }
  }

  if (Object.keys(bookByAuthor).length > 0) {
    return res.status(200).send(JSON.stringify(bookByAuthor));
  }

  return res.status(404).json({ message: "there is no book for this author" });
});

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const bookByTitle = {};

  for (const [ID, bookObj] of Object.entries(books)) {
    if (bookObj.title.toLocaleLowerCase() === title.toLocaleLowerCase()) {
      bookByTitle[ID] = bookObj;
    }
  }

  if (Object.keys(bookByTitle).length === 0) {
    return res
      .status(404)
      .json({ message: "there are no books by this title" });
  }
  return res.status(200).send(JSON.stringify(bookByTitle));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const bookID = req.params.review;
  const book_Obj_Review = {};

  for (const [ID, book] of Object.entries(books)) {
    if (bookID === ID) book_Obj_Review[ID] = book.reviews;
  }

  console.log(book_Obj_Review);

  return res.status(200).send(JSON.stringify(book_Obj_Review));
});

module.exports.general = public_users;
