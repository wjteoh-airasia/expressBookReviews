const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();
const crypto = require("crypto");

let users = [];

const login_session_secret = crypto.randomBytes(64).toString("hex");

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).send("Error logging in");
  }
  if (authenticatedUser(username, password)) {
    // Generate token
    let JW_Token = jwt.sign(
      {
        data: password,
      },
      login_session_secret,
      { expiresIn: 60 * 60 }
    );

    //Store Access Token and username in Session
    req.session.authorization = {
      JW_Token,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login: Please Check username and password" });
  }
});

// Add and Modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if (!req.session.authorization) {
    res.status(403).json({ message: "User not authenticated" });
  }
  const { isbn } = req.params;
  const { review } = req.body;

  if (!isbn && !review && review !== null) {
    return res
      .status(400)
      .json({ message: "Invalid input: ISBN and review should be required" });
  }

  if (books[isbn]) {
    const book = books[isbn];
    const getReviewObj = book["reviews"];
    const username = req.session.authorization.username;
    if (getReviewObj[username]) {
      getReviewObj[username] = { review: review };
      res.status(200).send(`Review modified successfully ISBN : ${isbn}`);
    } else {
      getReviewObj[username] = { review: review };
      res.status(200).send(`Review added successfully ISBN : ${isbn}`);
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization.username;

  if (books[isbn]) {
    const book = books[isbn];
    const review = book["reviews"];
    if (review[username]) {
      delete review[username];
      res.status(200).send("Review deleted successfully ");
    } else {
      res.status(404).send("Review not found");
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
module.exports.logSec = login_session_secret;
