const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // リクエストボディからユーザー名とパスワードを取得
  const { username, password } = req.body;

  // ユーザー名とパスワードが提供されているかチェック
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // ユーザー名が有効かチェック
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // ユーザー名が既に存在するかチェック
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // 新しいユーザーを追加
  users.push({ username, password });

  // 成功レスポンスを返す
  return res.status(201).json({ message: "User registered successfully" });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // create promise for getting books
  const getBooksPromise = new Promise((resolve, reject) => {

    setTimeout(() => {
      if (books && Object.keys(books).length > 0) {
        resolve(books);
      } else {
        reject("Books data not available");
      }
    }, 100);
  });

  // Process results using promises
  getBooksPromise
    .then((booksData) => {
      res.status(200).json(booksData);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    //  create promise for getting books with ISBN
    const getBookByISBNPromise = new Promise((resolve, reject) => {
      // Simulate Async
      setTimeout(() => {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject("Book not found with the given ISBN");
        }
      }, 100);
    });
    
    // Process results using promises
    getBookByISBNPromise
      .then((book) => {
        res.status(200).json(book);
      })
      .catch((error) => {
        res.status(404).json({ message: error });
      });
});
  
// Get book details based on author using Promise
public_users.get('/author/:author', function (req, res) {
    const requestedAuthor = req.params.author;
    
    //  create promise for getting books with author
    const getBooksByAuthorPromise = new Promise((resolve, reject) => {
      // Simulate Async
      setTimeout(() => {
        const bookIds = Object.keys(books);
        const authorBooks = [];
        
        // Check each book and add matching authors to the results array
        bookIds.forEach(id => {
          if (books[id] && books[id].author && 
              books[id].author.toLowerCase() === requestedAuthor.toLowerCase()) {
            authorBooks.push({
              isbn: id,
              title: books[id].title,
              author: books[id].author,
              reviews: books[id].reviews
            });
          }
        });
        
        if (authorBooks.length > 0) {
          resolve(authorBooks);
        } else {
          reject("No books found for this author");
        }
      }, 100);
    });
    
    // Process results using promises
    getBooksByAuthorPromise
      .then((books) => {
        res.status(200).json(books);
      })
      .catch((error) => {
        res.status(404).json({ message: error });
      });
});

// Get all books based on title using Promise
public_users.get('/title/:title', function (req, res) {
    const requestedTitle = req.params.title.toLowerCase();
    
    // Create a promise to search for books by title
    const getBooksByTitlePromise = new Promise((resolve, reject) => {
      // Simulate Async
      setTimeout(() => {
        const bookIds = Object.keys(books);
        const matchingBooks = [];
        
        // Check each book and add the ones whose title contains the search term to the results array
        bookIds.forEach(id => {
          if (books[id] && books[id].title && 
              books[id].title.toLowerCase().includes(requestedTitle)) {
            matchingBooks.push({
              isbn: id,
              title: books[id].title,
              author: books[id].author,
              reviews: books[id].reviews
            });
          }
        });
        
        if (matchingBooks.length > 0) {
          resolve(matchingBooks);
        } else {
          reject("No books found with this title");
        }
      }, 100);
    });
    
    // Process results using promises
    getBooksByTitlePromise
      .then((books) => {
        res.status(200).json(books);
      })
      .catch((error) => {
        res.status(404).json({ message: error });
      });
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    // リクエストパラメータからISBNを取得
    const isbn = req.params.isbn;
    
    // 指定されたISBNの本が存在するかチェック
    if (books[isbn]) {
      // 本が存在する場合、そのレビューを返す
      const reviews = books[isbn].reviews;
      
      // レビューがあるかチェック
      if (Object.keys(reviews).length > 0) {
        res.status(200).json(reviews);
      } else {
        res.status(404).json({ message: "No reviews found for this book" });
      }
    } else {
      // 本が存在しない場合はエラーを返す
      res.status(404).json({ message: "Book not found with the given ISBN" });
    }
  });

module.exports.general = public_users;
