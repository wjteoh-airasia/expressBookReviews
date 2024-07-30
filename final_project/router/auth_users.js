const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60*2});

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let review = req.body.review;
  if(isbn){
      let book = books[isbn];
      let username = req.session.authorization.username;
      if (book.reviews.hasOwnProperty(username)) {
        // Modify the existing review
        book.reviews[username].review = review;
        return res.status(200).json({ message: "Review modified successfully" });
      } else {
        // Add a new review for the user
        book.reviews[username] = {
          username: username,
          review: review,
        };
      return res.status(200).json({ message: "Review added successfully" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  if(isbn){
    let book = books[isbn];
      let username = req.session.authorization.username;
      if (book.reviews.hasOwnProperty(username)) {
        delete book.reviews[username];
        return res.status(200).json({ message: `${username} review(s) deleted.` });
      }else{
        return res.status(404).json({ message: "Operation Failed" });
      }
  }
  

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
