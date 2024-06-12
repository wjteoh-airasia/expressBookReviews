const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

//returns a boolean if the username is valid
const isValid = (username)=>{ 
  let user = users.find(user => user.username === username);
  return user !== undefined;
};

///Checks if username and password are authenticated
const authenticatedUser = (username, password) => {
    let user = users.find(user => user.username == username && user.password === password);
    return user !== undefined;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
 

  if (!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({username: username}, 'access', {expiresIn: '1h'});

    req.session.authorization = {
        accessToken
    }
  
     return res.status(200).json({message: "User successfully loged in"});
    }else {
     return res.status(401).json({message: "Invalid username or password"});
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
