const express = require('express');
const jwt = require('jsonwebtoken');
let booksDB = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "gowth", password: "test1234"}];

const isValid = (username)=> {
  let usersWithSameName = users.filter((user)=>{
    return user.username === username;
  });

  return !(usersWithSameName.length > 0);
}

const authenticatedUser = (username, password) => {
  let validUsers = users.filter((user)=>{
    return (user.username.toLowerCase() === username.toLowerCase() && user.password === password);
  });

  return validUsers.length > 0;
}

// only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
    }

    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).json({message: "Error, please input an isbn"});
  }

  if (!booksDB.books.hasOwnProperty(isbn)) {
    return res.status(200).json({ message: `ISBN '${isbn}' not found in bookstore.` });
  }

  const review = req.body.review;
  if (!review) {
    return res.status(404).json({message: "Error, please input a review"});
  }

  const username = req.session.authorization.username;
  booksDB.books[isbn].reviews[username] = review;
  return res.status(200).json(JSON.stringify(booksDB.books[isbn]));
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if (!isbn) {
    return res.status(404).json({message: "Error, please input an isbn"});
  }

  if (!booksDB.books.hasOwnProperty(isbn)) {
    return res.status(200).json({ message: `ISBN '${isbn}' not found in bookstore.` });
  }

  const username = req.session.authorization.username;
  if (!booksDB.books[isbn].reviews.hasOwnProperty(username)) {
    return res.status(200).json({ message: `Username '${username}' review for ISBN '${isbn}' not found in bookstore.` });
  }

  const review = booksDB.books[isbn].reviews[username];
  delete booksDB.books[isbn].reviews[username];
  return res.status(200).json({ message: `Username '${username}' review '${review}' for ISBN '${isbn}' is deleted.` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
