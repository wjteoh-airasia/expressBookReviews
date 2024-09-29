const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { message } = require('prompt');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}));

app.use("/customer/auth/*", function auth(req,res,next){
    const token = req.session.authorization.jwtToken
    if (!token){
        res.status(401).json({message:"Please login"});
        return ;
    }else{
        jwt.verify(token,'authentication',(error,user) =>{
            if(error){
                res.status(401).json({message:"Invalid token"});
                return; 
            }
            req.user = user;
        })
        next();
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));

