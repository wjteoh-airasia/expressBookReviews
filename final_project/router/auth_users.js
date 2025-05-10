const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

// Function to check if the user is authenticated
const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validusers.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Missing username or password" });
  }

  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: '1h' });

      req.session.authorization = { accessToken, username };
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(401).json({ message: "Invalid Login" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.body.review;
  const isbn = req.params.isbn;
  const username = req.user.data;
  const book = books[isbn];
  if(username && isbn && book){
    book.reviews[username] = review;
    return res.status(200).json({message: username + " review :" + review});
  }else{
    return res.status(500).json({message: "error"});
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data;
  const book = books[isbn];
  if(username && isbn && book){
    delete book.reviews[username];
    return res.status(200).json({message: username + " delete review for " + book.title});
  }else{
    return res.status(500).json({message: "error"});
  }

})
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
