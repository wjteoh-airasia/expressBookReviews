const axios = require("axios");

async function getAllBooks() {
  try {
    const response = await axios.get("http://localhost:5000/");
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
  }
}

async function getBookByISBN(isbn) {
  axios
    .get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error fetching book by ISBN:", error.message);
    });
}

async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching books by author:", error.message);
  }
}

async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching books by title:", error.message);
  }
}
