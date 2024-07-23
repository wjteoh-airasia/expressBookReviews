const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // Register the user
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/isbn/:isbn', (req, res) => {
  const id = req.params.isbn;
  const book = books[id];

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;

  try {
    const response = await axios.get(`${API_URL}/${isbn}`);
    const book = response.data;

    return res.status(200).json(book);
  } catch (error) {
    return res.status(404).json({ message: "Book not found" });
  }
});


public_users.get('/books', async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    const allBooks = response.data;

    return res.status(200).json(allBooks);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books" });
  }
});
  

public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = [];

  for (const id in books) {
    if (books[id].author === author) {
      booksByAuthor.push(books[id]);
    }
  }

  if (booksByAuthor.length > 0) {
    return res.status(200).json(booksByAuthor);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});


const fetchBooksByAuthor = async (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByAuthor = [];

      for (const id in books) {
        if (books[id].author.toLowerCase() === author.toLowerCase()) {
          booksByAuthor.push(books[id]);
        }
      }

      if (booksByAuthor.length > 0) {
        resolve(booksByAuthor);
      } else {
        reject(new Error("No books found for this author"));
      }
    }, 1000);
  });
};

public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  try {
    const booksByAuthor = await fetchBooksByAuthor(author);
    return res.status(200).json(booksByAuthor);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});


// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const booksByTitle = [];

  for (const id in books) {
    if (books[id].title.toLowerCase().includes(title.toLowerCase())) {
      booksByTitle.push(books[id]);
    }
  }

  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});


const fetchBooksByTitle = async (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const booksByTitle = [];

      for (const id in books) {
        if (books[id].title.toLowerCase().includes(title.toLowerCase())) {
          booksByTitle.push(books[id]);
        }
      }

      if (booksByTitle.length > 0) {
        resolve(booksByTitle);
      } else {
        reject(new Error("No books found with this title"));
      }
    }, 1000); // Simulate a delay of 1 second
  });
};

public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;

  try {
    const booksByTitle = await fetchBooksByTitle(title);
    return res.status(200).json(booksByTitle);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});


//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const id = req.params.isbn;
  const book = books[id];
  let bookFound = false;
      return res.status(200).json(books[id].reviews);
    
  
  
  if (!bookFound) {
    return res.status(404).json({ message: "Book not found or no reviews available" });
  }
});




module.exports.general = public_users;
