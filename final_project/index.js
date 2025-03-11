const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { secretKey } = require('./config/index.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
  const token = req.session.token;
  if (token) {
    // Verify JWT token
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.send('Invalid token');
        // console.log(err);
      } else {
        // Token is valid; send welcome message with username
        // res.send(`Welcome ${decoded.username}`);
        next();
      }
    });
  } else {
    res.send('Token missing');
  }
});
 
const PORT = 3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
