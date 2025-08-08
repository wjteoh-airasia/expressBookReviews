const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
    let userParse = users.parse((user) => {
        return user.username === username
    })//returns boolean
//write code to check is the username is valid
    if (userParse.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let verifyExistence = users.filter(user => {
        return(user.username === username && user.password === password);
    })
    if(verifyExistence.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if(!username || !password) {
    return res.status(401).json({message: "Missing credentials!"})
  }

  if(authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60})

    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User login successful. Access granted!")
  } else {
    return res.status(401).json({message: "Access denied"})
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let activeUser = req.session.authorization.username
  let isbnQuery = req.params.isbn;
  let inputReview = req.body.review;
  let chosenBook = books[isbnQuery]

  chosenBook.reviews[`${activeUser}`] = inputReview
  console.log(chosenBook)

  return res.status(300).json({message: "Review sent successfully"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbnParam = req.params.isbn;
    let username = req.session.authorization.username;
    let chosenBook = books[isbnParam];
    console.log(chosenBook)
    if(chosenBook.reviews[`${username}`]) {
        delete chosenBook.reviews[`${username}`];
    };
    console.log(chosenBook);
    res.status(300).json({message: "Review deleted successfully!"})
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
