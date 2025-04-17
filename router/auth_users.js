const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "john123", password: "password123" }];
// Secret key for signing JWTs
const JWT_SECRET = "access";
//app.use('/customer', regd_users);
const isValid = (username)=>{ //returns boolean
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  

  // Check if username or password is missing
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      const token = jwt.sign(
        { username: username },
        JWT_SECRET,
        { expiresIn: '1h' });
      // Store access token and username in session
      req.session.authorization = {
        username: username, // ← This is the key part!
        accessToken: token
      };
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added or updated successfully." });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization?.username;
  
    // Check if user is authenticated
    if (!username) {
      return res.status(401).json({ message: "User not authenticated" });
    }
  
    // Check if book exists
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found." });
    }
  
    const book = books[isbn];
  
    // Check if the user has a review
    if (!book.reviews || !book.reviews[username]) {
      return res.status(404).json({ message: "No review found for this user on the given book." });
    }
  
    // Delete the user's review
    delete book.reviews[username];
  
    return res.status(200).json({ message: "Review deleted successfully." });
  });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;



