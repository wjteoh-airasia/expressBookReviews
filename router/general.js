const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,11));
});
// Create a function that returns a Promise to get all books
const getBooks = () => {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("Books not found");
        }
    });
};

// Route to get books using the Promise function
public_users.get("/", (req, res) => {
    getBooks()
        .then((bookList) => {
            res.status(200).json(bookList);
        })
        .catch((err) => {
            res.status(500).json({ message: err });
        });
});  

// Function to get book by ISBN using a Promise
const getBookByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Book not found");
        }
    });
};

// Route to get book details by ISBN
public_users.get("/isbn/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    getBookByISBN(isbn)
        .then((book) => {
            res.status(200).json(book);
        })
        .catch((err) => {
            res.status(404).json({ message: err });
        });
});

// Function to get books by author using a Promise
const getBooksByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        const bookList = Object.values(books);
        const matchingBooks = bookList.filter(book => book.author === author);

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("No books found for the given author");
        }
    });
};

// Route to get books by author
public_users.get("/author/:author", (req, res) => {
    const author = req.params.author;

    getBooksByAuthor(author)
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((err) => {
            res.status(404).json({ message: err });
        });
});

// Function to get book(s) by title using Promise
const getBooksByTitle = (title) => {
    return new Promise((resolve, reject) => {
        const bookList = Object.values(books);
        const matchingBooks = bookList.filter(book => book.title === title);

        if (matchingBooks.length > 0) {
            resolve(matchingBooks);
        } else {
            reject("No books found for the given title");
        }
    });
};

// Route to get books by title
public_users.get("/title/:title", (req, res) => {
    const title = req.params.title;

    getBooksByTitle(title)
        .then((books) => {
            res.status(200).json(books);
        })
        .catch((err) => {
            res.status(404).json({ message: err });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase(); // Normalize for case-insensitive matching
  const matchingBooks = [];
  const bookEntries = Object.entries(books)
  for (const [isbn, book] of bookEntries) {
    if (book.author.toLowerCase() === author) {
        matchingBooks.push({ isbn, ...book });
    }
}
if (matchingBooks.length > 0) {
    res.status(200).json(matchingBooks);
} else {
    res.status(404).json({ message: "No books found for the given author." });
}
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase(); // Normalize for case-insensitive comparison
    const matchingBooks = [];

    // Loop through all books
    const bookEntries = Object.entries(books); // [ [isbn, bookObj], ... ]

    for (const [isbn, book] of bookEntries) {
        if (book.title.toLowerCase() === title) {
            matchingBooks.push({ isbn, ...book });
        }
    }

    if (matchingBooks.length > 0) {
        res.status(200).json(matchingBooks);
    } else {
        res.status(404).json({ message: "No books found with the given title." });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else if (book) {
    return res.status(200).json({ message: "No reviews yet." });
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

module.exports.general = public_users;




