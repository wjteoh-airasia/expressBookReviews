require('dotenv').config();  // Load environment variables from .env file
const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const { users } = require("./router/auth_users.js");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
      return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  // Split the Bearer keyword from the actual token
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. Invalid token format." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded; 
    next(); // Pass control to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
