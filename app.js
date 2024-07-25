const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser'); 

// Import the books database and routes from the correct files
const books = require('./booksdb.js');
const { general: public_users } = require('./general.js'); 

// Middleware
app.use(bodyParser.json()); 

// Route to get all books
app.get('/books', (req, res) => {
  res.json(books);
});

// Use the routes from general.js
app.use('/api', public_users); 

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
