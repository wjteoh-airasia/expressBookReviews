const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{uname:"jignesh",ups:"jin"},{uname:"rim",ups:"rim"}];


const secretKey = "Ramesh@superem11";

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return users.some(user => user.uname === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  return users.some(user => user.uname === username && user.ups === password);
}
//only registered users can login
regd_users.post("/login", (req,res) => {
  try {


      const {username,password} = req.body;
      console.log(username,password);
      
      if (!username || !password) {
          return res.status(400).json({ message: 'Username and password are required' });
        }
        
        if(authenticatedUser(username,password)) {
            const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
            
            req.session.user = username;
            return res.status(200).json({ message: 'Login successful', token });
        }
        return res.status(400).json({ message: 'Invalid username or password'});
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "loggin in ", error: err});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const token =  req.headers['Authorization'];
  if(!token) {
    return res.status(403).json({message :'No token provided'});
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if(err) {
        return res.status(401).json({message: 'Failed to authenticate token'});
    }
    const isbn = req.params.isbn;
    const username = decoded.username;
    const review = req.body.review;

    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' });
    }

    if (!review) {
      return res.status(400).json({ message: 'Review content is required' });
    }

    // Add or update the review
    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: 'Review added/updated successfully' });
  } );

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const token = req.headers['Authorization'];
  if(!token) {
    return res.status(403).json({message :'No token provided'});
  }
  jwt.verify(token, secretKey, (err, decoded) => {
    if(err) {
        return res.status(401).json({message: 'Failed to authenticate token'});
    }
    const isbn = req.params.isbn;
    const username = decoded.username;

    if (!books[isbn]) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Add or update the review
    if (books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: 'Review deleted successfully' });
      } else {
        return res.status(404).json({ message: 'Review not found for user' });
      }


  } );

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
