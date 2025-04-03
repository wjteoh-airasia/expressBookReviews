const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
// セッションが存在するかチェック
if (!req.session || !req.session.authorization) {
    return res.status(401).json({ message: "Unauthorized. Please login first" });
  }
  
  try {
    // JWTトークンを検証
    const token = req.session.authorization.accessToken;
    
    // トークンを検証（'access'はJWTの署名に使用した秘密鍵）
    jwt.verify(token, 'access', (err, decoded) => {
      if (err) {
        // トークンが無効または期限切れの場合
        return res.status(401).json({ message: "Invalid token. Please login again" });
      }
      
      // トークンが有効な場合、次のミドルウェアに進む
      next();
    });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error during authentication" });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
