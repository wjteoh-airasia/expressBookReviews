const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let newUserName = req.body.username;
  let newUserPass = req.body.password;
  if(!newUserName || !newUserPass) {
    return res.status(401).json({message: "Missing value for username or password"})
  }
  let existenceValidation = users.filter(user => compareExistence(user, newUserName));
  console.log(existenceValidation)
  if(existenceValidation.length > 0) {
    return res.status(401).json({message: "User is already registered"})
  } else {
    users.push({username: newUserName, password: newUserPass});
    return res.status(300).json({message: "New user registered!"})
  }
  function compareExistence(user, entry) {
    return user.username === entry;
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Basic, sychronous method to return book list.
    //res.status(300).send(JSON.stringify(books, null, 4));
    
    // Asynchronous, promise based method to return book list.
    let bookPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books)
        }, 3000)
    })
    bookPromise.then(response => {
        console.log(response);
        return res.status(300).send(JSON.stringify(response, null, 4))
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbnFilter = req.params.isbn;

  // Basic, synchronous method to return book info. based on ISBN
  //console.log(isbnFilter)
  //return res.status(300).send(JSON.stringify(books[isbnFilter]));

  // Asynchronous, promise based method to return book info. based on ISBN
    if(books[isbnFilter]) {
        let bookISBNPromise = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books[isbnFilter])
            }, 3000)
        });

        bookISBNPromise.then(response => {
            console.log(response);
            return res.status(300).send(JSON.stringify(response, null, 4))
        })
    } else {
        res.status(401).json({message: "Book not found!"});
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let authorQuery = req.params.author;
    let authorObj = {}
    // Basic, synchronous code for getting book info. based on author name
    //Object.keys(books).forEach(book => {
    //    if(books[book].author === authorQuery.replaceAll("_", " ")) {
    //        authorObj = books[book];
    //    }
    //});
    //return res.status(300).send(JSON.stringify(authorObj))

    // Asynchronous, promise-based code for getting book info. based on author name
    let authorFilterPromise = new Promise((resolve, reject) => {
        Object.keys(books).forEach(book => {
            if(books[book].author === authorQuery.replaceAll("_", " ")) {
                authorObj = books[book]
            };
        });
        setTimeout(() => {
            resolve(authorObj)
        }, 3000)
    })

    authorFilterPromise.then((response) => {
        if(!response.author) {
            return res.status(401).json({message: "Author not found!"})
        } else {
            return res.status(300).send(JSON.stringify(response));
        }
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let titleQuery = req.params.title;
  let titleObj = {};
  // Basic, synchronous code for getting book info. based on book title.
  //Object.keys(books).forEach(book => {
  //  if(books[book].title === titleQuery.replaceAll("_", " ") || books[book].title.indexOf(titleQuery) > -1) {
  //      titleObj = books[book];
  //  }
  //})
  //return res.status(300).send(JSON.stringify(titleObj));

  // Asynchronous, promise-based code for getting book info. based on book title
  let nameFilterPromise = new Promise((resolve, reject) => {
    Object.keys(books).forEach(book => {
        if(books[book].title === titleQuery.replaceAll("_", " ") || books[book].title.indexOf(titleQuery) > -1) {
            titleObj = books[book];
        }
    })
    setTimeout(() => {
        resolve(titleObj)
    }, 3000);
  })
  nameFilterPromise.then(response => {
    if(!response.author) {
        return res.status(401).json({message: "Title not found!"})
    } else {
        return res.status(300).send(JSON.stringify(response, null, 4))
    }
  })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let reviewQuery = req.params.isbn;
  if(books[reviewQuery]) {
    return res.status(300).json(books[reviewQuery].reviews)
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
