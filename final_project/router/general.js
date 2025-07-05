const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Tarea 1: Obtener la lista de libros
public_users.get('/', (req, res) => {
  return res.status(200).json({ books });
});

// Tarea 2: Obtener libro por ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Libro no encontrado para el ISBN dado." });
  }
});

// Tarea 3: Obtener libros por autor
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const matchingBooks = Object.values(books).filter(book => book.author === author);
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No se encontraron libros para ese autor." });
  }
});

// Tarea 4: Obtener libros por título
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const matchingBooks = Object.values(books).filter(book => book.title === title);
  if (matchingBooks.length > 0) {
    return res.status(200).json(matchingBooks);
  } else {
    return res.status(404).json({ message: "No se encontraron libros con ese título." });
  }
});

// Tarea 5: Obtener reseñas del libro
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No se encontraron reseñas para ese libro." });
  }
});

// Tarea 6: Registro de usuario
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Nombre de usuario y contraseña son requeridos." });
  }
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return res.status(400).json({ message: "El usuario ya existe." });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "Usuario registrado exitosamente." });
});


/* ----------- ASYNC/AWAIT VERSIONS (Tasks 10-13) ----------- */

// Simula delay para ver que sea realmente async
const delay = () => new Promise(resolve => setTimeout(resolve, 100));

// Tarea 10: Async obtener todos los libros
public_users.get('/async/books', async (req, res) => {
  try {
    await delay();
    res.json({ books });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener libros" });
  }
});

// Tarea 11: Async obtener libro por ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
  try {
    await delay();
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Libro no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener libro por ISBN" });
  }
});

// Tarea 12: Async obtener libros por autor
public_users.get('/async/author/:author', async (req, res) => {
  try {
    await delay();
    const author = req.params.author;
    const matchingBooks = Object.values(books).filter(book => book.author === author);
    if (matchingBooks.length > 0) {
      res.json(matchingBooks);
    } else {
      res.status(404).json({ message: "No se encontraron libros para ese autor" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener libros por autor" });
  }
});

// Tarea 13: Async obtener libros por título
public_users.get('/async/title/:title', async (req, res) => {
  try {
    await delay();
    const title = req.params.title;
    const matchingBooks = Object.values(books).filter(book => book.title === title);
    if (matchingBooks.length > 0) {
      res.json(matchingBooks);
    } else {
      res.status(404).json({ message: "No se encontraron libros con ese título" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener libros por título" });
  }
});



module.exports.general = public_users;
