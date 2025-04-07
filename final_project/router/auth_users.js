const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// const isValid = (username)=>{ 
// //write code to check is the username is valid

// }

const authenticatedUser = (username,password)=>{ 
    if(username && password) {
        let validUsers = users.filter((u) => u.username === username && u.password === password)
        if(validUsers.length > 0) {
            return true;
        }
        else {
            return false;
        }
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let uname = req.body.username;
    let pswd = req.body.password;

  if(uname && pswd) {
        if(authenticatedUser(uname, pswd)) {
            const accessToken = jwt.sign({data:pswd},"access", {expiresIn:60*60})
            req.session.authorization = {
                accessToken,
                uname
            }
            res.status(200).json({message:"User successfully logged in"})
        }
        else {
            return res.status(300).json({message: "Unable to login. Please check username and/or password"});
        }
    }
    else {
        return res.status(300).json({message: "Error to logging in."});
    }
  });

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let extractedReview = req.params.review;
  const token = req.session.authorization['accessToken']
  if(token) {
    
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
// module.exports.isValid = isValid;
module.exports.users = users;
