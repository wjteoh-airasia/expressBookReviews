const express = require('express');
const router = express.Router();
const { getAllBooks, getBooksByAuthor, getBooksByTitle, getBookByISBN } = require('../Controllers/BookController');

router.get('/', getAllBooks);
router.get('/isbn/:isbn', getBookByISBN);
router.get('/author/:author', getBooksByAuthor);
router.get('/title/:title', getBooksByTitle);

module.exports = router;
