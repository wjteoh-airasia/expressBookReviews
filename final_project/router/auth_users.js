const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  return !users.find((user) => user.username === username);
}

const authenticatedUser = (username,password)=>{
  return users.find((user) => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: {"username": username, "password": password}
    }, "access", {expiresIn: 60 * 60});

    return res.status(200).json({ 
      message: "Login Successful",
      accessToken
    });
  } else {
    return res.status(401).json({ message: "Please register to login" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.body.username;
  const review = req.body.review;

  books[isbn].reviews[username] = review;

  return res.json({ message: "Added review: " + review + " for book " + isbn + " by " + username})
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.body.username;
  delete books[isbn].reviews[username];
  return res.json({ message: "Deleted review for book " + isbn + " by " + username})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
