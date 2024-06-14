const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "user1", password: "password1" },
  { username: "user2", password: "password2" }];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{ //filters by username and password
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){ //if valid users are found
    return true;
  } else {
    return false;
  }
  //write code to check if username and password match the one we have in records.

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({ //generates access token
      data: username
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (!req.session.authorization) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
    
  }
  const username = req.session.authorization.username;
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  let book = books[isbn];
  if (!book.reviews) {
    book.reviews = {};
  }

  let review = book.reviews[username];
  book.reviews[username] = {};
  return res.status(200).json({ message: "Review deleted successfully:", book });

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  if (!req.session.authorization) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
    
  }
  // console.log("Authorized");

  const username = req.session.authorization.username;
  const review = req.body.review;
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  let book = books[isbn];
  if (!book.reviews) {
    book.reviews = {};
  }

  book.reviews[username] = review;

  return res.status(200).json({ message: "Review added/modified successfully:", book });
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
