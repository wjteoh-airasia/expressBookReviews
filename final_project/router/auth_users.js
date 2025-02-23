const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userwithsamename = users.filter(user=>{
    return user.username === username; 
  });
  if(userwithsamename.length > 0){
    return true;
  }
  else{
    return false;
  }
};

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validateUser = users.filter(user => {
    return (user.username == username && user.password === password);
  });
  if(validateUser.length > 0){
    return true;
  } else{
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username,password} = req.body;

  if(!username || !password){
    return res.status(404).json({message:'Error loggin in'});
  }

  if(authenticatedUser(username,password)){
    // Generate the JWT Token
    const accessToken = jwt.sign({data:password}, 'access', {expiresIn: 60 * 60});

    req.session.authorization = {
      accessToken,
      username
    }
    return res.status(200).json({message:'User logged in successfully'});
  } else {
    return res.status(208).json({message:'Invalid Login. Check username and password or Register'})
  }

});

// Add a book review or modify
regd_users.put("/auth/review/:isbn", (req, res) => {
  const {review} = req.query;
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];

  if(!review){
    return res.status(400).json({message:'Review is required'});
  }

  if(!books[isbn]){
    return res.status(404).json({message:'Book not found'});
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({message:'Book Review added or updated successfully', reviews: books[isbn].reviews});

});



// Delete a book review
regd_users.delete("/auth/review/:isbn", (req,res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];

  if(!books[isbn]){
    return res.status(404).json({message:'Book not found'});
  }

  if(!books[isbn].reviews[username]){
    return res.status(404).json({message:'No review found to delete'});
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({message:'Book Review deleted successfully', reviews: books[isbn].reviews});
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
