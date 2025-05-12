const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if username already exists
  if (users.some(user => user.username === username)) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Register the new user
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
// Alternative version with proper async/await pattern
public_users.get('/', async function (req, res) {
  try {
    // This would typically be a database call in production
    const fetchBooks = async () => {
      return new Promise((resolve, reject) => {
        // Simulating database/API delay
        setTimeout(() => {
          if (books) {
            resolve(books);
          } else {
            reject(new Error("Books not found"));
          }
        }, 100);
      });
    };

    const bookList = await fetchBooks();
    return res.status(200).json(bookList);
  } catch (err) {
    console.error("Error:", err.message);
    return res.status(500).json({message: "Error fetching book list"});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;

    // Async function to fetch book by ISBN
    const getBookByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        // Simulate async database/API call
        setTimeout(() => {
          const book = books[isbn];
          if (book) {
            resolve(book);
          } else {
            reject(new Error("Book not found"));
          }
        }, 100); // Small delay to simulate async operation
      });
    };

    const book = await getBookByISBN(isbn);
    return res.status(200).json(book);
    
  } catch (error) {
    if (error.message === "Book not found") {
      return res.status(404).json({message: error.message});
    }
    console.error("ISBN lookup error:", error);
    return res.status(500).json({message: "Error fetching book details"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;

    // Async function to search books by author
    const getBooksByAuthor = (authorName) => {
      return new Promise((resolve) => {
        // Simulate async operation
        setTimeout(() => {
          const booksByAuthor = {};
          for (const [id, book] of Object.entries(books)) {
            if (book.author.toLowerCase().includes(authorName.toLowerCase())) {
              booksByAuthor[id] = book;
            }
          }
          resolve(booksByAuthor);
        }, 100);
      });
    };

    const matchingBooks = await getBooksByAuthor(author);
    
    if (Object.keys(matchingBooks).length === 0) {
      return res.status(404).json({message: "No books found by this author"});
    }
    
    return res.status(200).json(matchingBooks);

  } catch (error) {
    console.error("Author search error:", error);
    return res.status(500).json({message: "Error searching by author"});
  }
});
// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
  
      // Async function to search books by title
      const getBooksByTitle = (titleQuery) => {
        return new Promise((resolve) => {
          // Simulate async operation
          setTimeout(() => {
            const booksByTitle = {};
            for (const [id, book] of Object.entries(books)) {
              if (book.title.toLowerCase().includes(titleQuery.toLowerCase())) {
                booksByTitle[id] = book;
              }
            }
            resolve(booksByTitle);
          }, 100);
        });
      };
  
      const matchingBooks = await getBooksByTitle(title);
      
      if (Object.keys(matchingBooks).length === 0) {
        return res.status(404).json({message: "No books found with this title"});
      }
      
      return res.status(200).json(matchingBooks);
  
    } catch (error) {
      console.error("Title search error:", error);
      return res.status(500).json({message: "Error searching by title"});
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  if (books[isbn] && books[isbn].reviews) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this ISBN" });
  }
});

module.exports.general = public_users;
