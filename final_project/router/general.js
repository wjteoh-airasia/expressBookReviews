const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
const fetchBooks = async () => {
    try {
      const response = await axios.get('https://shahmanav633-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/'); // Replace with your API endpoint
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error; // Propagate the error further
    }
  };
/* public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4))
  return res.status(300).json({message: "Yet to be implemented"});
}); */

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    // Retrieve the ISBN from the request parameters
    const isbn = req.params.isbn;
  
    try {
      // Fetch the book details asynchronously
      const book = await fetchBookByISBN(isbn);
  
      if (book) {
        // If the book is found, send the book details as JSON
        res.json(book);
      } else {
        // If the book is not found, send a 404 status and an error message
        res.status(404).json({ error: 'Book not found' });
      }
    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error(`Error fetching book with ISBN ${isbn}:`, error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
/*public_users.get('/isbn/:isbn',function (req, res) {
  
    //Retrieve book from ISBN using request parameter
  const isbn = req.params.isbn;

  // Check if that isbn is valid or not
  const book = books[isbn];
  if (book){
    // Display the book with isbn filter
    res.json(book)
  }
  else {
    // error message if book is not found
    res.status(400).json({message: "Book not found"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });*/
  
// Get book details based on author
const fetchBooksByAuthor = async () => {
    try {
      const response = await axios.get('http://api.example.com/books'); // Replace with your actual API endpoint
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  };
  // Route to get books by author
  public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
  
    try {
      const books = await fetchBooks();
  
      const isbnList = Object.keys(books);
      const bookbyauthor = isbnList
        .map(isbn => books[isbn])
        .filter(book => book.author.includes(author));
  
      if (bookbyauthor.length > 0) {
        res.json(bookbyauthor);
      } else {
        res.status(400).json({ message: "Book with a specific author not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching books" });
    }
  });


/*public_users.get('/author/:author',function (req, res) {
  //Filter book by author
  const author =req.params.author;
//Obtain all keys for books
  const isbnList = Object.keys(books);

  //Iterate through books array
  const bookbyauthor = isbnList
  .map(isbn => books[isbn])
  .filter(book => book.author.includes(author));

  if (bookbyauthor.length > 0) {
    res.json(bookbyauthor)
  }
  else {
    return res.status(400).json({message: "Book with a specific author not found"})
  }

  return res.status(300).json({message: "Yet to be implemented"});
});*/

// Get all books based on title
const fetchBooksByTitle = async () => {
    try {
      const response = await axios.get('https://shahmanav633-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title'); // Replace with your actual API endpoint
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  };
  public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;
  
    try {
      // Fetch books from the external API
      const books = await fetchBooks();
      
      const isbnList = Object.keys(books);
  
      const bookbytitle = isbnList
        .map(isbn => books[isbn])
        .filter(book => book.title.includes(title));
  
      if (bookbytitle.length > 0) {
        res.json(bookbytitle);
      } else {
        res.status(400).json({ message: "Book with the specific title is not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "An error occurred while fetching books", error });
    }
  });
  /*
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  const isbnList = Object.keys(books);

  const bookbytitle = isbnList
  .map(isbn => books[isbn])
  .filter(book => book.title.includes(title));

  if (bookbytitle.length > 0){
    res.json(bookbytitle)
  }
  else {
    return res.status(400).json({message: "Book witha a specific title is not found"})
  }
  return res.status(300).json({message: "Yet to be implemented"});
});*/

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    // Check if the book exists in the books object
    const book = books[isbn];
  
    if (book && book.reviews) {
      // If the book and reviews are found, send the reviews as JSON
      res.json(book.reviews);
    } else {
      // If the book or reviews are not found, send a 404 status and an error message
      res.status(404).json({ error: 'Reviews for the specified book not found' });
    }
  return res.status(300).json({message: "Yet to be implemented"});
});
module.exports = { fetchBooks };
module.exports.general = public_users;
