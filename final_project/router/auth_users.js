const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const bodyParser = require('body-parser');
regd_users.use(bodyParser.json());
let users = [
    { username: "user1", password: "password1" }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
    if (!isValid(username) || !authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Authentication failed. User not found or wrong password." });
    } else {
        const user = users.find(user => user.username === username);
        const token = jwt.sign({ username: user.username }, '', { expiresIn: '1h', algorithm: 'none' }); // Sign a token without a secret
        return res.status(200).json({
            message: "Authentication successful!",
            token: token
        });
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
