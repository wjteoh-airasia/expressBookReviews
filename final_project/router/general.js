const express = require('express');
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
module.exports.general = public_users;



/*************************************
 * Tareas 10-13 con Axios + Async/Await
 *************************************/
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Tarea 10: Obtener todos los libros
async function getAllBooks() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    console.log("Tarea 10 - Lista de libros:", response.data);
  } catch (error) {
    console.error("Error en Tarea 10:", error.message);
  }
}

// Tarea 11: Obtener libro por ISBN
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
    console.log(`Tarea 11 - Libro con ISBN ${isbn}:`, response.data);
  } catch (error) {
    console.error("Error en Tarea 11:", error.message);
  }
}

// Tarea 12: Obtener libros por autor
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`${BASE_URL}/author/${encodeURIComponent(author)}`);
    console.log(`Tarea 12 - Libros de ${author}:`, response.data);
  } catch (error) {
    console.error("Error en Tarea 12:", error.message);
  }
}

// Tarea 13: Obtener libros por título
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`${BASE_URL}/title/${encodeURIComponent(title)}`);
    console.log(`Tarea 13 - Libros con título '${title}':`, response.data);
  } catch (error) {
    console.error("Error en Tarea 13:", error.message);
  }
}

