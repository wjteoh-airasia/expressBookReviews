const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user ? user.password === password : false;
};

// Middleware de autenticación para rutas protegidas
const requireAuth = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.loggedIn) {
    return next();
  }
  return res.status(401).json({ 
    code: "UNAUTHORIZED",
    message: "Debe iniciar sesión para acceder a este recurso"
  });
};

// Registro de usuario
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      code: "CREDENTIALS_MISSING",
      message: "Nombre de usuario y contraseña son requeridos"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      code: "USER_EXISTS",
      message: `El usuario '${username}' ya está registrado`
    });
  }

  users.push({ username, password });
  return res.status(201).json({
    success: true,
    message: `Usuario '${username}' registrado exitosamente`
  });
});

// Inicio de sesión
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ 
      code: "MISSING_CREDENTIALS",
      message: "Usuario y contraseña son requeridos"
    });
  }

  if (authenticatedUser(username, password)) {
    req.session.user = {
      username: username,
      loggedIn: true,
      lastAccess: new Date()
    };
    return res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: {
        username: username,
        sessionId: req.sessionID
      }
    });
  } else {
    return res.status(401).json({
      code: "INVALID_CREDENTIALS",
      message: "Usuario o contraseña incorrectos"
    });
  }
});

// Cierre de sesión
regd_users.post("/logout", requireAuth, (req, res) => {
  req.session.destroy();
  return res.status(200).json({
    success: true,
    message: "Sesión cerrada exitosamente"
  });
});

// Agregar/modificar reseña (protegida)
regd_users.put("/auth/review/:isbn", requireAuth, (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;
  const username = req.session.user.username;

  if (!books[isbn]) {
    return res.status(404).json({
      code: "BOOK_NOT_FOUND",
      message: `Libro con ISBN ${isbn} no encontrado`
    });
  }

  if (!review || review.trim() === "") {
    return res.status(400).json({
      code: "REVIEW_REQUIRED",
      message: "La reseña no puede estar vacía"
    });
  }

  books[isbn].reviews = books[isbn].reviews || {};
  books[isbn].reviews[username] = review.trim();

  return res.status(200).json({
    success: true,
    message: "Reseña actualizada",
    book: {
      isbn: isbn,
      title: books[isbn].title,
      your_review: review
    }
  });
});

// Eliminar reseña (protegida)
regd_users.delete("/auth/review/:isbn", requireAuth, (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.user.username;

  if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({
      code: "REVIEW_NOT_FOUND",
      message: "No existe reseña para eliminar"
    });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    success: true,
    message: "Reseña eliminada",
    book: {
      isbn: isbn,
      title: books[isbn].title
    }
  });
});

module.exports = {
  authenticated: regd_users,
  isValid: isValid,
  users: users
};