const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();


let users = [];

let reviews = [];


//returns a boolean if the username is valid
const isValid = (username)=>{ 
  let user = users.find(user => user.username === username);
  return user !== undefined;
};

///Checks if username and password are authenticated
const authenticatedUser = (username, password) => {
    let user = users.find(user => user.username == username && user.password === password);
    return user !== undefined;
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
 

  if (!username || !password){
    return res.status(400).json({message: "Username and password are required"});
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({username: username}, 'access', {expiresIn: '1h'});

    req.session.authorization = {
        accessToken
    }
  
     return res.status(200).json({message: "User successfully loged in"});
    }else {
     return res.status(401).json({message: "Invalid username or password"});
   }
  }); 


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username; // Assummng username is stored in session
    const review = req.query.review; // Assuming review is sent as a query parameter

    if (!review) {
        return res.status(400).json({message:'Review is required'});
    }

    // FInd an existing review by the same user for the same ISBN
    let existingReview = reviews.find(r => r.username === username && r.isbn === isbn);

       if (existingReview) {
        // If an existing review is found, update it
        existingReview.review = review; 
    } else {
        // If no existing review is found, add a new one
        const newReview = {
          isbn,
          username,
          review,
          id: reviews.length + 1, // This is a simple way to generate a unique ID
        };
        reviews.push(newReview);
        }

    res.status(200).json({message: 'Review added/updated successfully'});
});


// Get all reviews for a specific book
regd_users.get("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    //FIlter the reviews array to get only the reviews for the book with the specified ISBN
    const bookReviews = reviews.filter(review => review.isbn === isbn);

    if(bookReviews.length >0) {
        res.status(200).json(bookReviews);
    } else {
        res.status(404).json({message: "No reviews found for this book"});
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
