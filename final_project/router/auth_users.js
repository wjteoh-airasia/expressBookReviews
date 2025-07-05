const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some((user) => user.username === username && user.password === password);
};

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Se requiere nombre de usuario y contraseña." });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "El usuario ya existe." });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "Usuario registrado exitosamente." });
});


regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Nombre de usuario y contraseña son requeridos." });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Credenciales inválidas." });
  }

  // Generar Token
  const accessToken = jwt.sign({ username }, "fingerprint_customer", { expiresIn: "1h" });

  // Guardar en sesión
  req.session.authorization = {
    accessToken,
    username
  };

  return res.status(200).json({ message: "Inicio de sesión exitoso." });
});



regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "No autorizado." });
  }

  if (!review) {
    return res.status(400).json({ message: "Se requiere el texto de la reseña en la consulta (?review=...)." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "ISBN no válido." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Reseña añadida o actualizada con éxito." });
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "No autorizado." });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "ISBN no válido." });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Reseña eliminada exitosamente." });
  } else {
    return res.status(404).json({ message: "No existe reseña para este usuario." });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
