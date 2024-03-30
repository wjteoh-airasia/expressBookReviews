const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

/ Tâche 10 : Obtenez la liste des livres disponibles dans la boutique avec des promesses ou une attente asynchrone avec Axios
public_users.get("/", async function (req, res) {
  try {
    // Simuler une requête HTTP pour obtenir la liste des livres
    // Vous pouvez remplacer cette requête avec votre propre logique de récupération des livres depuis la base de données ou une autre source
    const bookList = Object.values(books);
    res.json(bookList);
  } catch (error) {
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération de la liste des livres" });
  }
});

// Tâche 11 : Obtenez les détails du livre par ISBN avec des promesses ou une attente asynchrone avec Axios
public_users.get("/isbn/:isbn", async function (req, res) {
  const isbn = req.params.isbn;
  try {
    // Simuler une requête HTTP pour obtenir les détails du livre par ISBN
    // Vous pouvez remplacer cette requête avec votre propre logique de récupération des détails du livre depuis la base de données ou une autre source
    const book = books[isbn];
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ message: "Livre non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des détails du livre" });
  }
});

// Tâche 12 : Obtenez les détails du livre par auteur avec des promesses ou une attente asynchrone avec Axios
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    // Simuler une requête HTTP pour obtenir les détails du livre par auteur
    // Vous pouvez remplacer cette requête avec votre propre logique de récupération des détails du livre depuis la base de données ou une autre source
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
      res.json(booksByAuthor);
    } else {
      res.status(404).json({ message: "Aucun livre trouvé pour cet auteur" });
    }
  } catch (error) {
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des détails du livre" });
  }
});

// Tâche 13 : Obtenez les détails du livre par titre avec des promesses ou une attente asynchrone avec Axios
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    // Simuler une requête HTTP pour obtenir les détails du livre par titre
    // Vous pouvez remplacer cette requête avec votre propre logique de récupération des détails du livre depuis la base de données ou une autre source
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
      res.json(booksByTitle);
    } else {
      res.status(404).json({ message: "Aucun livre trouvé pour ce titre" });
    }
  } catch (error) {
    res.status(500).json({ message: "Une erreur s'est produite lors de la récupération des détails du livre" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
