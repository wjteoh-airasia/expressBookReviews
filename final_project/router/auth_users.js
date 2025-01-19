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
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "You need to provide a username and password to log in." })
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      username: username,
      password: password
    }, 'fingerprint_customer', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    req.session.user = username;
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login." });
  }
});

regd_users.get("/users", (req, res) => {
  return res.send(users);
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const token = req.session.authorization['accessToken'];
  const isbnParam = req.params.isbn;
  const reviewParam = req.query.review;

  if (token) {
    // Verify JWT token
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
      if (err) {
        res.send('Invalid token');
      } else {
      const book = Object.values(books).find(book => book.isbn === isbnParam);
    
      if (!book) {
        return res.status(404).send("Book not found");
      }
      if (!book.reviews) {
        book.reviews = {};
      }
      book.reviews[decoded.username] = reviewParam;
  
      return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: book.reviews
      });
      }
    });
  } else {
    return res.send('Token missing');
  }

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbnParam = req.params.isbn;
  const token = req.session.authorization['accessToken'];

  if (token) {
    // Verify JWT token
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
      if (err) {
        res.send('Invalid token');
      } else {
        const username = decoded.username;
        const book = Object.values(books).find(book => book.isbn === isbnParam);

        if (book.reviews && book.reviews[username]) {
          res.status(200).json({ message: "Review deleted successfully" });
        } else {
          res.status(404).json({ message: "Review not found" });
        }
      }
    });
  } else {
    return res.send('Token missing');
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
