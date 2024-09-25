require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.some((user) => {
    user.username === username;
  });

  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      process.env.SECRET_KEY,
      { expiresIn: 60 * 60 }
    );
    console.log("accessToken: " + accessToken);

    req.session.username = username;
    req.session.authorization = {
      accessToken,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  console.log("Received PUT request for ISBN:" + req.params.isbn);
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username;
  console.log("session: " + username);

  if (!review || !username) {
    return res
      .status(400)
      .json({ message: "Review text and username must be provided." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/modified successfully.",
    reviews: books[isbn].reviews,
  });
});

//Deleting a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  //Check if the user is logged in
  if (!username) {
    return res
      .status(401)
      .json({ message: "Unauthorized. Please log in to delete review." });
  }

  //Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  //Check if the book has reviews
  const reviews = books[isbn].reviews;
  if (!reviews || !reviews[username]) {
    return res
      .status(404)
      .json({ message: "No review found for the logged-in user" });
  }

  //Delete the review of the logged-in user
  delete reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully.",
    reviews: books[isbn].reviews,
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
