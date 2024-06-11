const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
//let users = require('./Users.js');
const regd_users = express.Router();


const users = []; // Define the users array

const isValid = (username) => { 
    let filtered_users = users.filter((user) => user.username === username);
    return filtered_users.length > 0; // Check if filtered_users array has any elements
};

const authenticatedUser = (username, password) => { 
    if (isValid(username)){
        let filtered_users = users.filter((user) => user.username === username && user.password === password);
        return filtered_users.length > 0;
    }
    return false;
};

regd_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if(username.length > 0 && password.length > 0){
        // Check if a user with the same username already exists
        if(users.some(user => user.username === username)){
            return res.status(400).json({message: "User already exists"});
        }

        users.push(req.body);
        console.log(users);
        return res.status(201).json({message: "User Created successfully"});
    } else {
        return res.status(400).json({message: "Check username and password"});
    }
});

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Invalid request. Provide both username and password." });
    }

    if (authenticatedUser(username, password)) {
        const accessToken = jwt.sign({ data: username }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = { accessToken, username };
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(401).json({ message: "Invalid Login. Check username and password." });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let userd = req.session.username;
  let ISBN = req.params.isbn;
  let details = req.query.review;
  let rev = {user:userd,review:details}
  books[ISBN].reviews = rev;
  return res.status(201).json({message:"Review added successfully"})
  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let ISBN = req.params.isbn;
    books[ISBN].reviews = {}
    return res.status(200).json({messsage:"Review has been deleted"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;