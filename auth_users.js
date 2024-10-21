const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    const user = users.find(user => user.username === username);
    return user && user.password === password;
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
    if(isValid(username)&&authenticatedUser(username,password))
  return res.status(300).json({message: "login successful"});
else return res.status(400).json({message: "don't register"});
});

// Add a book review

regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; 
    const review = req.body.review;
    const username = req.session.authorization.username; // 从 session 中获取已登录的用户名
    
    
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    
    if (!books[isbn].reviews) {
        books[isbn].reviews = {}; 
    }
    
    books[isbn].reviews[username] = review; 

    return res.status(200).json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn; // 获取书的 ISBN
    const username = req.session.authorization?.username; // 从会话中获取用户名

    // 检查书籍是否存在
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // 检查书评是否存在
    const reviews = books[isbn].reviews;
    if (!reviews || !reviews[username]) {
        return res.status(404).json({ message: "Review not found" });
    }

    // 删除用户的书评
    delete reviews[username];
    
    return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
