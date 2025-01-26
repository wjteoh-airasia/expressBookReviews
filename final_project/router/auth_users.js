const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const bcrypt = require('bcryptjs/dist/bcrypt.js');
const regd_users = express.Router();
const fs = require("fs")

let users = [];
// try{
//   users= JSON.parse(fs.readFileSync(users));
// } catch(err){
//   console.error(err);
// }

// Secret key for signing JWT
const secretKey = "1234";

// Function to check if username is valid
const isValid = (username)=>{   
  // Check if username is not empty and has only alphanumeric characters
  return /^[a-zA-Z0-9@._-]+$/.test(username);
}
// Function to check if username and password match the records
const authenticatedUser = (username,password)=>{ // Find the user in the users array
  const user = users.find((user) => user.username === username);
  if (!user) {
    return false;
}
 // Compare the provided password with the hashed password
 return bcrypt.compareSync(password, user.password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  // console.log("Users:", users)
  console.log("Username:", username)
  console.log("Password:", password)


  // Check if username and password are provided
  if (!username || !password) {
    res.status(400).send("Username and password are required");
    return;
  }
 
   // Check if username exists
   const user = users.find((user) => user.username === username);
   if (!user){
    res.status(401).send(" sorry!!! Invalid username or password");
    return;
  }
  console.log("User data:", user)
  // Check if password match the records
  
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  console.log("is password valid?", isPasswordValid)
  if (!isPasswordValid) {
    res.status(401).send("Invalid username or password");
    return;
  }
 

  // Create JWT payload
  const payload = { username };

  // Generate JWT token
  const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });

  res.send({ message: `User ${username} logged in successfully`, token });
});

// Middleware to authenticate users using JWT
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    res.status(401).send("Access denied. No token provided.");
    return;
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token.");
  }
};

// Add a book review
regd_users.put("/auth/review/:isbn", authenticate, (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.user.username;

  //check if review is provided
  if(!review){
    res.status(400).send("review is required");
    return;
  }

  // Find the book in the books object
  const book = books[isbn];

  if (!book) {
    res.status(404).send(`Book with ISBN ${isbn} not found`);
    return;
  }

  // // Add the review to the book
  // if(!book.reviews) {
  //   book.reviews || [];
  // }

  book.reviews.push({ username, review });

  res.send({ message: `Review added successfully for book with ISBN ${isbn} by ${username}`, review, });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", authenticate, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username;

  // Find the book in the books object
  const book = books[isbn];

  if (!book) {
    res.status(404).send(`Book with ISBN ${isbn} not found`);
    return;
  }

  // Filter out the review from the book's reviews array
  const reviews = book.reviews.filter(review => review.username !== username);

  // If the review was found and deleted, update the book's reviews array
  if (reviews.length !== book.reviews.length) {
    book.reviews = reviews;
    res.send({ message: `Review deleted successfully for book with ISBN ${isbn}` });
  } else {
    res.status(404).send(`Review not found for book with ISBN ${isbn}`);
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;


console.log(users)
