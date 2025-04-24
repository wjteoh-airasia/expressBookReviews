const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  // Check if session exists
  if (!req.session) {
    return res.status(440).json({message: "Session expired"});
  }
  
  // Check if session contains authorization data
  if (!req.session.authorization) {
    return res.status(403).json({message: "Not authorized. Please login"});
  }
  
  // Get token from session
  const token = req.session.authorization.accessToken;
  
  // Verify JWT token
  jwt.verify(token, "access", (err, user) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({message: "Token expired, please login again"});
      }
      return res.status(403).json({message: "Authentication failed", error: err.message});
    }
    
    // Set user data in request object and proceed
    req.user = user;
    next();
  });
});
 
const PORT = 3002;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running on port " + PORT));
