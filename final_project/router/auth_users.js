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
    const isbnInput = req.params.isbn;
    const userReview = req.query.review;
    const usrname = req.session.authorization?.uname;

    if(!usrname) {
        return res.status(401).json({message : "User not logged in"})
    }
    if(!books[isbnInput]) {
        return res.status(404).json({message : "Book not found. Please check ISBN number"})
    }
    if(!userReview) {
        return res.status(400).json({message : "Review content is missing. Please add a review"})
    }

    books[isbnInput].reviews[usrname] = userReview;
    
    return res.status(200).json({message: "Review added successfully", book: books[isbnInput]});
});

regd_users.delete("/auth/review/:isbn", (req,res) => {
    const isbnByUser = req.params.isbn;
    const username1 = req.session.authorization?.uname;
    const book = books[isbnByUser];

    if(!username1) {
        return res.status(401).json({message : "User not logged in"})
    }
    if(!book) {
        return res.status(404).json({message : "Book not found. Please check ISBN number"})
    }
    if(book.reviews && book.reviews[username1]) {
        delete book.reviews[username1]
        return res.status(200).json({message : "Review deleted successfully", book})
    }
    else {
        return res.status(404).json({message : "No review found for this user to delete"})
    }
}) 


module.exports.authenticated = regd_users;
// module.exports.isValid = isValid;
module.exports.users = users;
