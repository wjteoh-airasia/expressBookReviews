const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    // ユーザー名が有効かチェック（ここでは単純に存在チェック）
    return username !== undefined && username.trim() !== '';
}

const authenticatedUser = (username, password) => { //returns boolean
// 指定されたユーザー名とパスワードが一致するユーザーを検索
    const user = users.find(user => user.username === username && user.password === password);
    return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    // リクエストボディからユーザー名とパスワードを取得
    const username = req.body.username;
    const password = req.body.password;
  
    // ユーザー名またはパスワードが欠けている場合
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // ユーザー認証
    if (authenticatedUser(username, password)) {
      // JWT アクセストークンを生成
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 }); // 1時間有効
  
      // アクセストークンとユーザー名をセッションに保存
      req.session.authorization = {
        accessToken, 
        username
      };
      
      return res.status(200).json({ 
        message: "User successfully logged in",
        token: accessToken 
      });
    } else {
      return res.status(401).json({ message: "Invalid Login. Check username and password" });
    }
});




// Add a book review
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // セッションから認証情報を確認
    if (!req.session || !req.session.authorization) {
      return res.status(401).json({ message: "Unauthorized. Please login first" });
    }
  
    // ユーザー名をセッションから取得
    const username = req.session.authorization.username;
    
    // ISBNをパラメータから取得
    const isbn = req.params.isbn;
    
    // レビュー内容をリクエストクエリから取得
    const review = req.query.review;
    
    // 必須パラメータのチェック
    if (!review) {
      return res.status(400).json({ message: "Review content is required" });
    }
    
    // 指定したISBNの本が存在するかチェック
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found with the given ISBN" });
    }
    
    // レビューを追加または更新
    // ユーザー名をキーとして、そのユーザーのレビューを保存
    books[isbn].reviews[username] = review;
    
    // 成功レスポンスを返す
    return res.status(200).json({ 
      message: "Review added/updated successfully",
      book: books[isbn].title,
      user: username,
      review: review
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    // セッションから認証情報を確認
    if (!req.session || !req.session.authorization) {
      return res.status(401).json({ message: "Unauthorized. Please login first" });
    }
  
    // ユーザー名をセッションから取得
    const username = req.session.authorization.username;
    
    // ISBNをパラメータから取得
    const isbn = req.params.isbn;
    
    // 指定したISBNの本が存在するかチェック
    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found with the given ISBN" });
    }
    
    // 本のレビューオブジェクトを取得
    const reviews = books[isbn].reviews;
    
    // レビューオブジェクトが存在するかチェック
    if (!reviews) {
      return res.status(404).json({ message: "No reviews exist for this book" });
    }
    
    // 現在のユーザーのレビューが存在するかチェック
    if (!reviews.hasOwnProperty(username)) {
      return res.status(403).json({ 
        message: "You don't have a review for this book or you're not authorized to delete other users' reviews" 
      });
    }
    
    // ユーザーのレビューを削除
    delete reviews[username];
    
    // 成功レスポンスを返す
    return res.status(200).json({ 
      message: "Review deleted successfully",
      book: books[isbn].title,
      isbn: isbn,
      review: books[isbn].reviews
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
