const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
const accessToken = req.session.accessToken;
 if (!accessToken){
    return res.status(401).send("Unauthorized access")
 }
verifyAccessToken(accessToken)
 .then((decoded) =>{
    req.user = decoded;
    next();
 })
 .catch((error) => {
    return res.status(401).send("Invalid access token");
 });
 
function verifyAccessToken(accessToken){
    return new Promise((resolve, reject) => {
        const secretKey = 'your secret key here';
        jwt.verify(accessToken, secretKey, (err, decoded)=>{
            if (err){
                reject(err);
            }else{
                resolve(decoded);
            }
        });
    });
}
 
});
 
const PORT =5000;

app.use("/costomer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running on http://localhost:5000"));
