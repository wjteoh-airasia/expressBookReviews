
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

//  Middleware
app.use(express.json()); // Parse JSON body
app.use(session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

//  Mount routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// ✅ Dynamic Port Handling
const DEFAULT_PORT = 5000;
let server = app.listen(DEFAULT_PORT, () => {
  console.log(`✅ Server running at http://localhost:${DEFAULT_PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.warn(`⚠️ Port ${DEFAULT_PORT} is busy. Trying a random free port...`);
    server.close();
    server = app.listen(0, () => {
      const newPort = server.address().port;
      console.log(`✅ Server restarted at http://localhost:${newPort}`);
    });
  } else {
    console.error(" Server error:", err);
  }
});