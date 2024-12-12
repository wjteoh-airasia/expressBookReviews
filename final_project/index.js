const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const JWT_SECRET = "qadhwu8343wedwiu4";

const app = express();

app.use(express.json());

app.use("/customer", session({secret:"fingerprint_customer", resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken'];
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).json({message: 'User not authenticated'});
            }
        })
    } else {
        return res.status(403).json({message: 'User not logged in'})
    }

    // const {name, password} = req.body;
    // if (name === "user" && password === "user") {
    //     return res.json({
    //         token: jwt.sign({user: 'user'}, JWT_SECRET)
    //     });
    // }
    // return res
    //     .status(401)
    //     .json({message: 'Invalid username/password'});
});
 
const PORT = 5001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, ()=> console.log("Server is running"));
