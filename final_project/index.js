const express = require('express');
const session = require('express-session');
const genl_routes = require('./router/general.js').general;
const auth_routes = require('./router/auth_users.js').authenticated;

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Public and Authenticated Routes
app.use("/", genl_routes);        // Task 1–6 routes (public)
app.use("/customer", auth_routes); // Task 7–8 routes (login, review)

// Server start
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
