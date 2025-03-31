const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            return true;
    }
  }

  return false;
}

const authenticatedUser = (username, password) => {
    console.log("Authenticating user:", username, password); 
  
    for (let i = 0; i < users.length; i++) {
      console.log("Checking against:", users[i]); 
  
      if (users[i].username === username && users[i].password === password) {
        return true; 
      }
    }
  
    return false; 
  };


//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    console.log("Login attempt:", username, password); 
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
  
    console.log("Current users:", users); 
  
    if (authenticatedUser(username, password)) {
      console.log("Authentication successful for:", username);
      const accessToken = jwt.sign({ username }, "access", { expiresIn: "1h" });
  
      req.session.authorization = {
        accessToken,
        username,
      };
  
      return res.status(200).json({ message: "User successfully logged in!" });
    } else {
      console.log("Authentication failed for:", username); 
      return res.status(401).json({ message: "Invalid login. Please check your username or password." });
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  console.log(`Received PUT request for ISBN: ${req.params.isbn}`);
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not authenticated!"});
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: `Book with ISBN: ${isbn} not found!`});
  }

  if (!review) {
    return res.status(400).json({ message: "Review cannot be empty!"});
  }

  const existingReviews = books[isbn].reviews;

  if (existingReviews[username]) {
    existingReviews[username] = review;
    return res.status(200).json({ message: `Review successfully updated for ISBN: ${isbn}!`});
  } else {
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: `Review successfully added for ISBN: ${isbn}!`});
  }
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book with the given ISBN not found!"});
  }

  if (!username) {
    return res.status(403).json({ message: "User not authenticated!"});
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({message: "Review successfully deleted!"});
  } else {
    return res.status(404).json({ message: "No review found for you to delete. Please add a review!"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
