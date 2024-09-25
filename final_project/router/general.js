const express = require('express');
let books = require("./booksdb.js");
const jwt = require('jsonwebtoken');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Secret key for JWT (keep this safe and secure)
const JWT_SECRET = "your_jwt_secret"; // Change this to a more secure value in production

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401); // No autorizado

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Prohibido
        req.user = user; // Almacena la información del usuario en la solicitud
        next(); // Procede al siguiente middleware/ruta
    });
}

public_users.post("/customer/:login", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username exists and if the password matches
    const user = users[username];
    if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // If valid, create a JWT token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour

    // Return the token
    return res.status(200).json({ message: "Login successful", token });
    
});


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    // Comprobar si se proporcionan nombre de usuario y contraseña
    if (!username || !password) {
        return res.status(400).json({ message: "Se requiere nombre de usuario y contraseña." });
    }

    // Comprobar si el nombre de usuario ya existe
    if (users[username]) {
        return res.status(400).json({ message: "El nombre de usuario ya existe." });
    }

    // Si el nombre de usuario es válido, agrega el nuevo usuario
    // Aquí puedes aplicar el hashing a la contraseña
    users[username] = { password }; // En producción, usa un hash para la contraseña
    return res.status(201).json({ message: "Usuario registrado con éxito." });
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.status(200).send(JSON.stringify(books, null, 2));
//   //return res.status(300).json({message: "Yet to be implemented"});
// });

public_users.get('/books', (req, res) => {
    axios.get('/books') 
        .then(response => {
            const bookList = response.data;
            return res.status(200).json(bookList);
        })
        .catch(error => {
            return res.status(500).json({ message: "Error fetching book list", error: error.message });
        });
});




// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//     const isbn = req.params.isbn;
    
//     // Assume `books` is an object containing all the book details
//     const book = books[isbn];
    
//     if (book) {
//         // Return the book details as a JSON response
//         res.json(book);
//     } else {
//         // If the book with the given ISBN is not found, return an error message
//         res.status(404).json({ message: "Book not found" });
//     }
//  });

public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    
    const book = books[isbn];
    
    if (book) {
        
        return res.status(200).json(book);
    } else {
        
        return res.status(404).json({ message: "Book not found" });
    }
});




  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Retrieve the author from the request parameters
  const author = req.params.author;
    
  // Initialize an empty array to store books by the given author
  let booksByAuthor = [];

  // Iterate through the 'books' object
  for (let isbn in books) {
      if (books[isbn].author === author) {
          // If the book's author matches the provided author, add it to the array
          booksByAuthor.push(books[isbn]);
      }
  }

  // If any books by the author are found, return them
  if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
  } else {
      // If no books are found, return an appropriate message
      res.status(404).json({ message: "No books found by this author" });
  }
});

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   // Retrieve the title from the request parameters
//   const title = req.params.title;
    
//   // Initialize an empty array to store books with the given title
//   let booksByTitle = [];

//   // Iterate through the 'books' object
//   for (let isbn in books) {
//       if (books[isbn].title === title) {
//           // If the book's title matches the provided title, add it to the array
//           booksByTitle.push(books[isbn]);
//       }
//   }

public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    
    let booksByTitle = [];

    for (let isbn in books) {
        if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
            booksByTitle.push(books[isbn]);
        }
    }

    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});


  // If any books with the title are found, return them
  if (booksByTitle.length > 0) {
      res.json(booksByTitle);
  } else {
      // If no books are found, return an appropriate message
      res.status(404).json({ message: "No books found with this title" });
  }
;

//  Get book review
public_users.post("/review/:isbn", authenticateToken, (req, res) => {
    const isbn = req.params.isbn;
    const { review } = req.query; // Obtener la reseña del parámetro de consulta
    const username = req.user.username; // Obtener el nombre de usuario del usuario autenticado

    // Verificar si se proporciona la reseña
    if (!review) {
        return res.status(400).json({ message: "Se requiere una reseña." });
    }

    // Verificar si el libro existe en la base de datos
    if (!books[isbn]) {
        return res.status(404).json({ message: "Libro no encontrado." });
    }

    // Verificar si la reseña ya existe para este ISBN por parte del usuario
    const existingReviewIndex = books[isbn].reviews.findIndex(r => r.username === username);
    
    if (existingReviewIndex !== -1) {
        // Si la reseña existe, modificarla
        books[isbn].reviews[existingReviewIndex].review = review;
        return res.status(200).json({ message: "Reseña actualizada con éxito." });
    } else {
        // Si la reseña no existe, agregarla
        books[isbn].reviews.push({ username, review });
        return res.status(201).json({ message: "Reseña agregada con éxito." });
    }
});

public_users.delete("/auth/review/:isbn", authenticateToken, (req, res) => {
    const isbn = req.params.isbn; // Obtener el ISBN del parámetro
    const username = req.user.username; // Obtener el nombre de usuario del token

    // Verificar si el libro existe
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Obtener la lista de reseñas del libro
    const reviews = books[isbn].reviews;

    // Encontrar el índice de la reseña que pertenece al usuario actual
    const reviewIndex = reviews.findIndex(review => review.username === username);

    // Si no se encuentra la reseña, devolver un error
    if (reviewIndex === -1) {
        return res.status(404).json({ message: "Review not found for this user" });
    }

    // Eliminar la reseña del usuario
    reviews.splice(reviewIndex, 1); // Eliminar la reseña del arreglo

    // Devolver una respuesta exitosa
    return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.general = public_users;