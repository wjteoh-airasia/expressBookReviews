const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {username:"tony", password:"qwerty"},
    {username:"jack", password:"qwerty"},
];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
    const regex = /^[a-zA-Z0-9_]{3,15}$/
    if (regex.test(username)) {
        return true
    } else {
        return false
    }
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    const user = users.find(usr => usr.username === username)
    if (user.password === password) {
        return user
    } else {
        return false
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username
    const password = req.body.password
    const user = authenticatedUser(username, password)
    if(user){
        jwt.sign({user:user},'jacksparrow',(err,token)=>{
            if(token){
                req.session.jwt_token = token
                return res.status(200).json({ 
                    jwt_token:token,
                    message: "User logged in" });
            }else{
                return res.status(400).json({ 
                    error:err,
                    message: "Error occured" });
            }
        })
    }else{
        return res.status(404).json({
            message: "User not found or invalid password"
        });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn
        if (isbn in books) {
            const book = books[isbn]
            book.reviews = req.query.review
            return res.status(200).json({
                review: book.reviews,
                message: "Book review updated"
            });
        }else{
            return res.status(404).json({ 
                message: "Book not found" });
        }
    
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn
        if (isbn in books) {
            const book = books[isbn]
            book.reviews = {}
            return res.status(200).json({
                review: book.reviews,
                message: "Book review deleted"
            });
        }else{
            return res.status(404).json({ 
                message: "Book not found" });
        }
    
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
