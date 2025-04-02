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
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
