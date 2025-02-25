const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

// let users = [];
let users=[
    {
     username:"admin",
     password:"1234"
    }
   ];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some((user)=>user.username===username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some((user)=>user.username===username && user.password===password);

}

//only registered users can login
regd_users.post("/register", (req,res) => {

  //Write your code here
  const {username,password}=req.body;
  
 if(!username || !password){
   return  res.status(400).json({message:"username and password required"});
 }
 
   if(isValid(username)){
    console.log("not valid");
    return  res.status(409).json({message:"user already found"});
   }
  //  if(!authenticatedUser(username,password)){
  //   console.log("In valid");

  //   return  res.status(401).json({message:"Invalid Credentials"});
  //  }
    users.push({username,password});
 
  return res.status(200).json({message: "user registered successfully"});
});
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password required." });
  }

  if (!isValid(username)) {
      return res.status(404).json({ message: "User not found." });
  }

  if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Invalid credentials." });
  }

  // ✅ Generate JWT token
  const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });

  return res.status(200).json({ message: "Login successful.", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn=req.params.isbn;
  const {review}=req.query;
  const username=req.session.username;
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
}

// Check if the user has already reviewed this ISBN
const existingReviewIndex = books.reviews.findIndex(r => r.isbn === isbn && r.username === username);

if (existingReviewIndex !== -1) {
    // Modify the existing review
    books.reviews[existingReviewIndex].review = review;
    return res.status(200).json({ message: "Review updated successfully" });
} else {
    // Add a new review
   books. reviews.push({ isbn, username, review });
    return res.status(201).json({ message: "Review added successfully" });
}
});
  // if(!username){
  //   return res.status(401).json({message:"Unauthorized. Please log in first."});
  // }
  // if(!books[isbn]){
  //   return res.status(404).json({message:"Book not found"});
  // }
  // if(!review){
  //   return res.status(404).json({message:"Review cannot be empty"});

  // }
  // if(!books[isbn].reviews){
  //   books[isbn].reviews={};
  // }
  // books[isbn].reviews[username]=review;
  // return res.status(300).json({message: "Review added/updated successfully",book:books[isbn]});
// });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
