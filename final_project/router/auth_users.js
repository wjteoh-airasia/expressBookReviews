const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "tester0", password: "p123" }];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
  return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  
  if(username && password){
    if(authenticatedUser(username,password)){
      let token = jwt.sign({username:username}, 'my-secret-key', { expiresIn: '2h' });
      req.session.authorization = {
        token, username
      }
      return res.status(200).send(JSON.stringify({message: "Log in successfully", token: token} , null, 4) + "\n");
    }
    else{
      return res.status(404).json({message: "Username or password is incorrect"});
    }
  }
  else {
    return res.status(400).json({message: "Invalid username or password"});
  }
});

// Add a book review
/*
regd_users.get("/auth/review/:isbn", (req, res) => {
  //console.log("here")
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.session.authorization.username;
  //console.log(req)

  if(books[isbn]){
    books[isbn].reviews=([review]);
    return res.status(200).send(JSON.stringify({message: "Review added successfully"} , null, 4) + "\n");
  }
  else{
    return res.status(404).json({message: "No book found with ISBN "+isbn});
  }
});
*/
regd_users.get("/auth/review/:isbn", (req, res) => {
  //console.log("here")
  console.log(req)
  let isbn = req.params.isbn;
  let review = req.query.review;
  let username = req.headers.username;

  if(books[isbn]) {
    if(books[isbn].reviews[username]){
      books[isbn].reviews[username]=([review]);
      return res.status(200).send(JSON.stringify({message: "Review updated successfully"} , null, 4) + "\n");
    }
    else{
      books[isbn].reviews[username]=([review]);
      return res.status(200).send(JSON.stringify({message: "Review added successfully"} , null, 4) + "\n");
    }
  }
  else {
    return res.status(404).json({message: "No book found with ISBN "+isbn});
  }
});

// Delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let username = req.headers.username;
  if (isbn&&username) {
    if(books[isbn]){
      if(books[isbn].reviews[username]){
        delete books[isbn].reviews[username];
        return res.status(200).json({ message: "Review deleted successfully" });
      }
      else{
        return res.status(404).json({message: "No review found with given ISBN for current user. User= "+ username + ", ISBN= "+ isbn});
      }
    }
    else{
      return res.status(404).send(JSON.stringify({message: "No book found with given ISBN "+isbn} , null, 4) + "\n");
    }
  }
  else {
    return res.status(400).json({message: "Error"});
  }

})


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
