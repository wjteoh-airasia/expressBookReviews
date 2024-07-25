const axios = require('axios');

// Base URL of your API
const API_URL = 'http://localhost:5000';

// Function to retrieve all books using async/await
async function getAllBooks() {
  try {
    const response = await axios.get(`${API_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Error retrieving books:', error);
    throw error;
  }
}

// Function to search for a book by ISBN using Promises
function getBookByISBN(isbn) {
  return axios.get(`${API_URL}/isbn/${isbn}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error retrieving book by ISBN:', error);
      throw error;
    });
}

// Function to search for books by author using Promises
function getBooksByAuthor(author) {
  return axios.get(`${API_URL}/author/${author}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error retrieving books by author:', error);
      throw error;
    });
}

// Function to search for books by title using Promises
function getBooksByTitle(title) {
  return axios.get(`${API_URL}/title/${title}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error retrieving books by title:', error);
      throw error;
    });
}

// Example usage
(async () => {
  try {
    const allBooks = await getAllBooks();
    console.log('All Books:', allBooks);

    const bookByISBN = await getBookByISBN('1234567890');
    console.log('Book by ISBN:', bookByISBN);

    const booksByAuthor = await getBooksByAuthor('Author A');
    console.log('Books by Author:', booksByAuthor);

    const booksByTitle = await getBooksByTitle('Book A');
    console.log('Books by Title:', booksByTitle);
  } catch (error) {
    console.error('Error in API operations:', error);
  }
})();
