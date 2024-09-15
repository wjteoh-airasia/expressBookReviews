const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const userWithSameName = users.filter(user => user.username === username)
    if (userWithSameName.length > 0) {
        return false;
    }else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.filter(user => user.username === username && user.password === password)
    if (user.length > 0) {
        return true;
    }else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
        {data: password}, "access", {expiresIn: 60 * 60}
    )
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).json({message: "User logged in successfully!"})
  }
  return res.status(208).json({
    message: "Unable to log in. Please enter correct username and password!"}
);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const review = req.body.review;
    const username = req.session.authorization.username;
    const isbn = req.params.isbn;

    if (review && username) {
        const book = books[isbn];
        if (book) {
            book.reviews[username] = review;
            return res.status(200).json({message: "Review submitted successfully!"});
        }else{
            return res.status(404).json({message: "Book not found!"});
        }
    }else {
        return res.status(400).json({nessage: "Please check review and username!"})
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
