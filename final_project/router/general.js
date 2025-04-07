const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (userName) => {
    let usernames = users.filter(u => u.username === userName);
    if(usernames.length > 0) {
        return true;
    }
    else {
        return false;
    }
}
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if(username && password) {
    if(!doesExist(username)) {
        users.push({"username" : username, "password" : password});
        return res.status(200).json({message: "User successfully registered. Please log in"});
    }
    else {
        return res.status(404).json({message: "User already exiss! Please log in"});
    }
  }
  return res.status(404).json({message: "Unable to register. Please check username or password"})
});

function getBooks() {
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(books)
        }, 3000)
    })
}
public_users.get('/',function (req, res) {
    getBooks().then((listOfBooks) => {
        res.status(200).send(JSON.stringify(listOfBooks, null, 4))
    })
});

function getBooksByISBN(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn]
            if(book) {
                resolve(book)
            }
            else {
                reject("Book not found")
            }
        },3000)
    });
}
//Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let getisbn = req.params.isbn;
    getBooksByISBN(getisbn)
      .then((book) => {
          res.status(200).send(book)
      })
      .catch((error) => {
          res.status(404).json({message : error})
      })
});

function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let matchingBooks = []
            for(let isbn in books) {
                let book = books[isbn];
                if(book.author.toLowerCase().includes(author)) {
                    matchingBooks.push(book)
                }
            }
            if(matchingBooks.length > 0) {
                resolve(matchingBooks)
            }
            else {
                reject("No book found for this author")
            }
            
        }, 3000)
    })
}

public_users.get('/author/:author',function (req, res) {
    let authr = req.params.author.toLowerCase();
    getBooksByAuthor(authr)
    .then((booksByAuthor) => {
        res.status(200).send(booksByAuthor)
    })
    .catch((error) => {
        res.status(404).json({message : error})
    })
});

function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let matchedBooks = []
            for(let isbn in books) {
                const book = books[isbn];
                if(book.title.toLowerCase().includes(title)) {
                    matchedBooks.push(book)
                }
            }
            if(matchedBooks.length > 0) {
                resolve(matchedBooks);
            }
            else {
                reject("No book found with this title")
            }
        })
    })
}
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let titl = req.params.title.toLowerCase();
    getBooksByTitle(titl)
        .then((matchedBooks) => {
            res.status(200).send(matchedBooks)
        })
        .catch((error) => {
            res.status(404).json({message : error})
        })
});


// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   res.send(JSON.stringify(books, null,4));
//   return res.status(300).json({message: ""});
// });



// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   let getisbn = req.params.isbn;
//   let book = books[getisbn];
//   if(book) {
//     res.json(book);
//   }
//   else {
//     res.status(404).json({message: "Book not found"});
//   }
//  });


  
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//     let authr = req.params.author.toLowerCase();
//     let authors = [];
//     for(let isbn in books) {
//         const book = books[isbn];
//         if(book.author.toLowerCase().includes(authr)) {
//             authors.push(book);
//         }
//     }
//     if(authors.length > 0) {
//         res.json(authors);
//     }
//     else {
//         return res.status(404).json({message: "No books found for this author"});
//     }
    
// });

// // Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//     let titl = req.params.title.toLowerCase();
//     let booksByTitle = [];
//     for(let isbn in books) {
//         const book = books[isbn];
//         if(book.title.toLowerCase().includes(titl)) {
//             booksByTitle.push(book);
//         }
//     }
//     if(booksByTitle.length > 0) {
//         res.json(booksByTitle);
//     }
//     else {
//         return res.status(404).json({message: "No books found for this title"});
//     }
// });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let inputisbn = req.params.isbn;
  let book = books[inputisbn];
  if(book) { 
    res.json(book.review);
  }
  else {
    return res.status(300).json({message: `Book with ${inputisbn} not found`});
  }
  
});

module.exports.general = public_users;
