const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return username && username.trim().length >= 3 && username.trim().length <= 30;
}

const authenticatedUser = (username, password) => {
  console.log('Users in database:', users);
  const user = users.find(user => user.username === username);
  console.log('Found user:', user);
  return user && user.password === password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  if (!username || !password){
    {
      return res.status(400).json({message: "username and password are required"});
    }
  }
  const isAuthenticated = authenticatedUser(username, password);
  console.log('Authentication result:', isAuthenticated);
  if(!isAuthenticated){
    return res.status(401).json({message: "Invalid username or password"});
  }

  const token = jwt.sign(
    {username: username},
    process.env.JWT_SECRET || 'your-security-key',
    {expiresIn: "1h"}
  );
  
  req.session.user = {username};
  return res.status(200).json({
    message: "Login successful",
    token: token,
    username: username
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


