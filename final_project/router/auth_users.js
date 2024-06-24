const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
   const filteredUsers = users.filter((user)=> user.username === username) 
   return filteredUsers.length > 0
}

const authenticatedUser = (username,password)=>{ 
    const filteredUsers = users.filter((user)=> user.username === username && user.password === password)
    return filteredUsers.length > 0
}

//only registered users can login
regd_users.post("/login", (req,res) => {
 const username = req.body.username;
 const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const review = req.query.review
  const isbn = req.params.isbn
  const username = req.session.authorization.username

  books[isbn].reviews[username] = review

  return res.send('Review added to book '+JSON.stringify(books[isbn],' ',4))
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const review = req.query.review
  const isbn = req.params.isbn
  const username = req.session.authorization.username

  delete books[isbn].reviews[username]

  return res.send('Review removed from book '+JSON.stringify(books[isbn],' ',4))
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
