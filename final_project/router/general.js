const express = require('express');
const axios = require('axios'); // Necesario para las funciones con promesas
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

/***************** TAREA 10 - Obtener todos los libros (Async/Await) *****************/
public_users.get('/async', async (req, res) => {
  try {
    const bookList = await getAllBooksAsync();
    return res.status(200).json({
      success: true,
      books: bookList
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error al obtener los libros"
    });
  }
});

// Función auxiliar Async/Await
async function getAllBooksAsync() {
  return new Promise((resolve) => {
    // Simulamos un retraso de red
    setTimeout(() => {
      resolve(books);
    }, 1000);
  });
}

/***************** TAREA 11 - Obtener libro por ISBN (Promesas) *****************/
public_users.get('/promise/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  
  getBookByIsbnPromise(isbn)
    .then(book => {
      if (book) {
        res.status(200).json({
          success: true,
          book: book
        });
      } else {
        res.status(404).json({
          success: false,
          message: `Libro con ISBN ${isbn} no encontrado`
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        error: "Error al buscar el libro"
      });
    });
});

// Función auxiliar con Promesa
function getBookByIsbnPromise(isbn) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error("Libro no encontrado"));
      }
    }, 1000);
  });
}

/***************** TAREA 12 - Obtener libros por autor (Async/Await) *****************/
public_users.get('/async/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const booksByAuthor = await getBooksByAuthorAsync(author);
    
    if (booksByAuthor.length > 0) {
      return res.status(200).json({
        success: true,
        count: booksByAuthor.length,
        books: booksByAuthor
      });
    } else {
      return res.status(404).json({
        success: false,
        message: `No se encontraron libros del autor '${author}'`
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Error al buscar libros por autor"
    });
  }
});

// Función auxiliar Async/Await
async function getBooksByAuthorAsync(author) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matchingBooks = [];
      Object.entries(books).forEach(([isbn, book]) => {
        if (book.author && book.author.toLowerCase().includes(author.toLowerCase())) {
          matchingBooks.push({
            isbn: isbn,
            title: book.title,
            author: book.author,
            reviews: book.reviews || {}
          });
        }
      });
      resolve(matchingBooks);
    }, 1000);
  });
}

/***************** TAREA 13 - Obtener libros por título (Promesas) *****************/
public_users.get('/promise/title/:title', (req, res) => {
  const title = req.params.title;
  
  getBooksByTitlePromise(title)
    .then(booksByTitle => {
      if (booksByTitle.length > 0) {
        res.status(200).json({
          success: true,
          count: booksByTitle.length,
          books: booksByTitle
        });
      } else {
        res.status(404).json({
          success: false,
          message: `No se encontraron libros con el título '${title}'`
        });
      }
    })
    .catch(error => {
      res.status(500).json({
        success: false,
        error: "Error al buscar libros por título"
      });
    });
});

// Función auxiliar con Promesa
function getBooksByTitlePromise(title) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const matchingBooks = [];
      Object.entries(books).forEach(([isbn, book]) => {
        if (book.title && book.title.toLowerCase().includes(title.toLowerCase())) {
          matchingBooks.push({
            isbn: isbn,
            title: book.title,
            author: book.author,
            reviews: book.reviews || {}
          });
        }
      });
      resolve(matchingBooks);
    }, 1000);
  });
}

/***************** Rutas originales (se mantienen igual) *****************/
public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/',function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 2));
});

public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json({
      message: "Libro encontrado",
      book: books[isbn]
    });
  } else {
    return res.status(404).json({
      message: "Libro no encontrado",
      error: `Libro no encontrado con el ISBN ${isbn}`
    });
  }
});

public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const matchingBooks = [];
  const isbns = Object.keys(books);
  
  for (const isbn of isbns) {
    const book = books[isbn];
    if (book.author && book.author.toLowerCase() === author.toLowerCase()) {
      matchingBooks.push({
        isbn: isbn,
        title: book.title,
        reviews: book.reviews || {}
      });
    }
  }

  if (matchingBooks.length > 0) {
    return res.status(200).json({
      message: `Libros encontrados del autor '${author}'`,
      count: matchingBooks.length,
      books: matchingBooks
    });
  } else {
    return res.status(404).json({
      message: `No se encontraron libros del autor '${author}'`,
      suggestion: "Verifique el nombre del autor o intente con otro"
    });
  }
});

public_users.get('/title/:title', function (req, res) {
  try {
    const requestedTitle = req.params.title.toLowerCase();
    const matchingBooks = [];

    Object.entries(books).forEach(([isbn, book]) => {
      if (book.title && book.title.toLowerCase() === requestedTitle) {
        matchingBooks.push({
          isbn: isbn,
          title: book.title,
          author: book.author,
          reviews: book.reviews || {}
        });
      }
    });

    if (matchingBooks.length > 0) {
      return res.status(200).json({
        success: true,
        count: matchingBooks.length,
        books: matchingBooks,
        search_details: {
          title: req.params.title,
          match_type: "exact"
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        error: "No books found",
        suggestions: [
          "Check for typos",
          "Try partial title search",
          "Verify book exists in our database"
        ]
      });
    }
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  try {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
      const reviews = book.reviews || {};
      const reviewCount = Object.keys(reviews).length;

      return res.status(200).json({
        success: true,
        isbn: isbn,
        title: book.title,
        review_count: reviewCount,
        reviews: reviews,
        message: reviewCount > 0 
          ? "Reviews found" 
          : "No reviews available for this book"
      });
    } else {
      return res.status(404).json({
        success: false,
        error: {
          code: "BOOK_NOT_FOUND",
          message: `Book with ISBN ${isbn} not found`
        }
      });
    }
  } catch (error) {
    console.error("Review fetch error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

module.exports.general = public_users;