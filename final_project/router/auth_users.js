const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ username }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,
      username,
    };

    return res.status(200).json({ message: 'user successfully logged in!' });
  } else {
    return res
      .status(401)
      .json({ message: 'Invalid Login. Check username and password' });
  }

  // res.send('login user, my user');
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  const { review } = req.body;
  const { username } = req.user;
  book.reviews[username] = review;

  // console.log({ isbn, review });

  return res.status(201).json({ message: 'review added', book });
});

// delete book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const book = books[isbn];
  const reviews = book.reviews;
  const { username } = req.user;
  delete reviews[username];

  // console.log({ isbn, review });

  return res.status(200).json({ message: 'review deleted', book });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
