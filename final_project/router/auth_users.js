const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
let filteredUser = users.filter(user => user.username === username  && user.password === password);
    if(filteredUser.length > 0){
      return true
    }else{
      return false;
    }
}


//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  let isAuthenticated = authenticatedUser(username, password)
 if(isAuthenticated){
  let accessToken = jwt.sign({
    username: username,
    password: password
  },'access',{ expiresIn: 60*60});

  req.session.authorization = {
    accessToken, username
  }
  // return res.status(200).send('User successfully logged in', accessToken);
  return res.status(200).send({'message':'User successfully logged in','accessToken': accessToken});

 }else{
  return res.status(400).json({message: "Invalid login. Check username and password"});
 }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let username = req.user.username;
  let booksArray = [];
  let review = req.body.review
  for (const [key, value] of Object.entries(books)) {
    booksArray.push(value);
  }
  const isbn = req.params.isbn;
  let filtered_book = booksArray[isbn-1];
  if(filtered_book?.reviews[username]){
    for ( var property in filtered_book?.reviews ) {      
      if(property === username){
        filtered_book.reviews[username] = review;
      res.send({"Action":"updated", "book":filtered_book});    
      }else{
        filtered_book.reviews[username] = review
      res.send({"Action":"added", "book":filtered_book});
      }
    }
  }else{
    filtered_book.reviews[username] = review
    res.send({"Action":"added", "book":filtered_book});
  }  
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let username = req.user.username;
  let booksArray = [];
  for (const [key, value] of Object.entries(books)) {
    booksArray.push(value);
  }
  const isbn = req.params.isbn;
  let filtered_book = booksArray[isbn-1];
  if(filtered_book?.reviews[username]){
    for ( var property in filtered_book?.reviews ) {      
      if(property === username){
       delete filtered_book?.reviews[property];
      res.send(filtered_book);    
      }else{   
        res.status(400);     
        res.send("Access denied");
      }
    }
  }else{
    res.status(400);     
    res.send("Access denied");
  }  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
