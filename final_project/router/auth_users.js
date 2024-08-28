const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const crypto = require('crypto');


let users = [];

const session_secret = crypto.randomBytes(64).toString('hex');

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  const v_user = users.filter((user) => {
    return user.username == username;

  })
  if (v_user.length > 0) {
    return true;
  } else {
    return false;
  }
};

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const auth_user = users.filter((user) => {
    return (user.username == username && user.password == password);

  });
  if (auth_user.length > 0) {
    return true;
  } else { 
    return false; 
  }
};
const add = ()=>{

};

const modify =()=>{

};




//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).send("Error logging in")
  }
  if (authenticatedUser(username, password)) {

    // Generate token
    let JW_Token = jwt.sign({
      data: password
    }, session_secret, { expiresIn: 60 * 60 });

    //Store Access Token and username in Session
    req.session.authorization = {
      JW_Token, username
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login: Please Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if(book){
    let review = req.body.reviews;
    if(review){
      book['reviews'] = review;
    }
    books[isbn] = book;
    return res.send(`Book with the ISBN ${isbn} Updated reviews`)
  }else{
   return res.send(`Unable to find book with ISBN ${isbn}`);
  }
  

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
