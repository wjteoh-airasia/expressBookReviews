const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// Autenticación basada en token de sesión
app.use("/customer/auth/*", (req, res, next) => {
  const token = req.session.authorization?.accessToken;

  if (!token) {
    return res.status(401).json({ message: "No autorizado: token no encontrado en sesión" });
  }

  jwt.verify(token, "fingerprint_customer", (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
    req.user = user;
    next();
  });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
