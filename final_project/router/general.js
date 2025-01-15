const express = require('express');
const axios = require('axios'); // Import Axios
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// User registration
public_users.post("/register", (req, res) => {
    const { username, password } = req.body; // Get username and password from request body

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: "Username already exists." });
    }

    // Add the new user to the users array
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." }); // Respond with success message
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4));
});

// Function to get the list of books
public_users.get('/books', async (req, res) => {
    try {
        const response = await axios.get('https://eminyeni-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/'); // Adjust the URL as needed
        const booksList = response.data; // Assuming the response returns the list of books
        return res.status(200).json(booksList);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching books." });
    }
});

public_users.get('/isbn/:isbn', (req, res) => {
    const { isbn } = req.params;
    const bookDetails = Object.values(books).find(book => book.isbn === isbn);
    
    if (bookDetails) {
        return res.status(200).json(bookDetails);
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});


// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const { author } = req.params; // Retrieve the author from request parameters
    const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === author.toLowerCase()); // Filter books by author

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks); // Return matching books if found
    } else {
        return res.status(404).json({ message: "No books found by this author" }); // Return 404 if no books found
    }
});

// Function to get book details based on Author using Axios
public_users.get('/author/:author', async (req, res) => {
    const { author } = req.params; // Retrieve the author from request parameters
    try {
        const response = await axios.get(`https://eminyeni-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/author/${author}`); // Adjust URL if necessary
        const booksByAuthor = response.data; // Assuming the response returns the books by the specified author
        return res.status(200).json(booksByAuthor);
    } catch (error) {
        console.error('Error fetching books by author:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: "Error fetching books by author." });
    }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const { title } = req.params; // Retrieve the title from request parameters
    const matchingBooks = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase()); // Filter books by title

    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks); // Return matching books if found
    } else {
        return res.status(404).json({ message: "No books found with this title" }); // Return 404 if no books found
    }
});

// Function to get book details based on Title using Axios
public_users.get('/title/:title', async (req, res) => {
    const { title } = req.params; // Retrieve the title from request parameters
    try {
        const response = await axios.get(`https://eminyeni-5000.theianext-1-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/title/${title}`); // Adjust URL if necessary
        const booksByTitle = response.data; // Assuming the response returns the books by the specified title
        return res.status(200).json(booksByTitle);
    } catch (error) {
        console.error('Error fetching books by title:', error.response ? error.response.data : error.message);
        return res.status(500).json({ message: "Error fetching books by title." });
    }
});


// Get book reviews based on ISBN
public_users.get('/review/:isbn', (req, res) => {
    const { isbn } = req.params; // Retrieve the ISBN from request parameters
    const book = Object.values(books).find(book => book.isbn === isbn); // Find the book by ISBN

    if (book) {
        return res.status(200).json(book.reviews); // Return the reviews if the book is found
    } else {
        return res.status(404).json({ message: "Book not found" }); // Return 404 if no book found
    }
});

module.exports.general = public_users;
