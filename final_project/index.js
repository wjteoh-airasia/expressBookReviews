const express = require('express');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Configuración de sesión DEBE IR ANTES de montar las rutas
app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false } // Para desarrollo sin HTTPS
}));

// Montaje de rutas
app.use("/", genl_routes); // Rutas públicas
app.use("/customer", customer_routes); // Rutas de cliente (login, registro, etc.)

// Middleware de autenticación para rutas protegidas
app.use("/customer/auth/*", function auth(req, res, next) {
    if (!req.session.user) {
        return res.status(401).json({ message: "No autorizado" });
    }
    next();
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));