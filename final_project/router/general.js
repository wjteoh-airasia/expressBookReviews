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
public_users.get('/',function (req, res) {
  //Write your code here
   res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    // リクエストパラメータから著者名を取得
    const requestedAuthor = req.params.author;
    
    // 結果を格納する配列
    const authorBooks = [];
    
    // booksオブジェクトのすべてのキー（ISBN）を取得
    const bookIds = Object.keys(books);
    
    // 各本をチェックし、著者が一致するものを結果配列に追加
    bookIds.forEach(id => {
      if (books[id].author.toLowerCase() === requestedAuthor.toLowerCase()) {
        // 著者が一致した場合、その本の情報を結果に追加
        authorBooks.push({
          isbn: id,
          title: books[id].title,
          author: books[id].author,
          reviews: books[id].reviews
        });
      }
    });
    
    // 結果が見つかったかチェック
    if (authorBooks.length > 0) {
      res.status(200).json(authorBooks);
    } else {
      res.status(404).json({ message: "No books found for this author" });
    }
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    // リクエストパラメータからタイトルを取得
    const requestedTitle = req.params.title.toLowerCase();
    
    // 結果を格納する配列
    const matchingBooks = [];
    
    // booksオブジェクトのすべてのキー（ISBN）を取得
    const bookIds = Object.keys(books);
    
    // 各本をチェックし、タイトルに検索語が含まれるものを結果配列に追加
    bookIds.forEach(id => {
      if (books[id].title.toLowerCase().includes(requestedTitle)) {
        // タイトルが部分一致した場合、その本の情報を結果に追加
        matchingBooks.push({
          isbn: id,
          title: books[id].title,
          author: books[id].author,
          reviews: books[id].reviews
        });
      }
    });
    
    // 結果が見つかったかチェック
    if (matchingBooks.length > 0) {
      res.status(200).json(matchingBooks);
    } else {
      res.status(404).json({ message: "No books found with this title" });
    }
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
