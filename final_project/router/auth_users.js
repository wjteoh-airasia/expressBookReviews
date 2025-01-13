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
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
