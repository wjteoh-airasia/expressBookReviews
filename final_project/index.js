const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const books_route = require('./router/booksdb.js');
const { authenticated } = require('./router/auth_users.js');

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))


app.use("/customer/auth/*", function auth(req, res, next){
    // Get the JWT token from the request header or query parameter
    const token = req.headers.authorization; // Assuming token is passed in the Authorization header
    console.log(token)

    // Check if token is provided
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token is missing" });
    }

    try {
        // Verify the token
        jwt.verify(token, 'my-secret-key', (err, user) => {
            if (err) {
                // Token verification failed
                res.status(401).json({ error: 'Unauthorized: Invalid token' });
            } else {
                req.session.user = user;
                //res.status(200).json({ message: "Verification successful" });
                next();
            }
        })
    } catch (error) {
        // Token is invalid or expired
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
});

 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
