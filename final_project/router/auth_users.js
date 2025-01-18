const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  {
    "username": "nini",
    "password": "senhadaora"
  },
  {
    "username": "rapha",
    "password": "terrapequena" 
  }
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.filter((user) => {
    return user.username === username;
  });
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.filter((user) => {
    if (isValid(username) && user.password === password) {
      return true;
    }
  });
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  console.log(users);
  const username = req.body.username;
  const password = req.body.password;

  console.log(username);

  if (!username || !password) {
    return res.status(400).json({message: "You need to provide a username and password to log in." })
  }

  if (authenticatedUser(username, password)) {

    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login." });
  }
});

regd_users.get("/users", (req, res) => {
  console.log(users);
  return res.send(users);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
