const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const general_routes = require("./router/general.js").general;
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(
  "/customer",
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    let token = req.session.authorization["accessToken"];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

const PORT = process.env.PORT || 5000;

app.use("/customer", customer_routes);
app.use("/", general_routes);

app.listen(PORT, () => console.log("Server is running"));
