const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Both username and password are required' });
    }

    // Check if username already exists
    if (users[username]) {
        return res.status(409).json({ error: 'Username already exists' });
    }

    // Add the new user to the database
    users[username] = password;
    res.status(201).json({ message: 'User registered successfully' });
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/ISBN/:ISBN',function (req, res) {
    const requestedIsbn = req.params.isbn;
    
    // Searching through the books
        for (let book of books) {
            if(book.isbn === requestedIsbn) {
                res.send(book);
                return;
            }
        }
    });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const requestedAuthor = req.params.author; // this is the author you're looking for

//create an empty list to store matching books
    const matchingBooks = []

// Searching through the books
    for (let book of books) {
        if(book.author === requestedAuthor) {
            matchingBooks.push(book)
        }
    }

// Response with matching books found
if (matchingBooks.length > 0) {
    res.send(matchingBooks);
} else {
    res.send('No books found by author name')
}

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const requestedTitle = req.params.title;

//create an empty list to store matching books
    const matchingBooks = []

// Searching through the books
    for (let book of books) {
        if(book.title === requestedTitle) {
            matchingBooks.push(book)
        }
    }

// Response with matching books found
if (matchingBooks.length > 0) {
    res.send(matchingBooks);
} else {
    res.send('No books found by title')
}

});


//  Get book review
public_users.get('/reviews/:ISBN',function (req, res) {
        const ISBN = req.params.ISBN;
// Find the book with the ISBN 
        const book = books.find(book => book.ISBN === ISBN);
      
        if (book) {
          res.send(book.reviews);
        } else {
          res.send('No reviews found for that ISBN.');
        }
      });


module.exports.general = public_users;