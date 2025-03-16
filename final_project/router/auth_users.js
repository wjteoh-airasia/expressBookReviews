const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
require("dotenv").config();

let users = [];

console.log(users);

const isValid = (username) => {
  const valid_user = users.filter((user) => user.username === username);

  if (valid_user.length > 0) {
    return true;
  }

  return false;
};

const authenticatedUser = (username, password) => {
  const valid_user = users.filter(
    (user) => user.username === username && user.password === password
  );

  if (valid_user.length > 0) {
    return true;
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        { data: username },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: 3600,
        }
      );

      req.session.authorization = {
        accessToken,
        username,
      };

      return res.status(200).json({ message: "Logged in succesfully !" });
    } else {
      return res.status(404).send({ message: "user is not authenticated" });
    }
  } else {
    return res.status(404).json({ message: "an error has occured" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbnID = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;

  if (!username || !isbnID || !review) {
    return res.status(404).json({ message: "an error has occured" });
  }

  if (!books[isbnID]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbnID].review[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    book: books[isbn],
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbnID = req.params.isbn;
  const username = req.session.username;

  if (!username || !isbnID) {
    return res.status(404).json({ message: "an error has occured" });
  }

  if (!books[isbnID]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbnID].reviews || !books[isbnID].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbnID].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
    book: books[isbnID],
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
