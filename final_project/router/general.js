const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

function fetchData(url) {
    return new Promise((resolve, reject) => {
        axios.get(url)
            .then(response => resolve(response.data))
            .catch(error => reject(error));
    });
}


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books,null,4));
});



// Get the book list available in the shop
public_users.get('/async/', function (req, res) {
    fetchData('https://jizatojirayu-7000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/')
        .then(fetchedBooks => res.status(200).json({ books: fetchedBooks }))
        .catch(error => {
            console.error('Error fetching books:', error.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn]);
 });

 public_users.get('/async/isbn/:isbn', function (req, res) {
    fetchData(`https://jizatojirayu-7000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/isbn/${req.params.isbn}`)
        .then(fetchedBooks => res.status(200).json({ books: fetchedBooks }))
        .catch(error => {
            console.error('Error fetching books:', error.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        });
});
  
// Get book details based on author
public_users.get('/async/author/:author', function (req, res) {
    fetchData(`https://jizatojirayu-7000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/${req.params.author}`)
        .then(fetchedBooks => res.status(200).json(fetchedBooks))
        .catch(error => {
            console.error('Error fetching books:', error.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        });
});

public_users.get('/async/author/:author', async function (req, res) {
    try {
        const response = await axios.get('https://jizatojirayu-7000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/author/'+req.params.author);
        
        const fetchedBooks = response.data;

        return res.status(200).json(fetchedBooks);
    } catch (error) {
        console.error('Error fetching books:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  });


// Get all books based on title
public_users.get('/async/title/:title', function (req, res) {
    fetchData(`https://jizatojirayu-7000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/${req.params.title}`)
        .then(fetchedBooks => res.status(200).json(fetchedBooks))
        .catch(error => {
            console.error('Error fetching books:', error.message);
            return res.status(500).json({ error: 'Internal Server Error' });
        });
});

public_users.get('/async/title/:title', async function (req, res) {
    try {
        const response = await axios.get('https://jizatojirayu-7000.theiadockernext-1-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/title/'+req.params.title);
        
        const fetchedBooks = response.data;

        return res.status(200).json(fetchedBooks);
    } catch (error) {
        console.error('Error fetching books:', error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(books[isbn]["reviews"]);
});

module.exports.general = public_users;
