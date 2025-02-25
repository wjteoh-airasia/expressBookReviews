const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// public_users.post("/register", (req,res) => {
//   //Write your code here
//   return res.status(300).json({message: "Yet to be implemented"});
// });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.json({message: "All Books"},books);
    // res.send(b00ks);
  //Write your code here
//   res.send(JSON.stringify(books));
//   return res.status(300).json({message: "All Books"});this gives error as already res.send there
});
public_users.get('/books',async (req,res)=>{
   try{
    res.json({books});
   }
   catch(error){
    return res.status(500).json({message: "Error Fetching books",error});

   }
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    try{
        const isbn=req.params.isbn;
    if(!books[isbn]){
        return res.status(404).json({message:"not Found with Isbn"})
    }
    const bookDetails={...books[isbn],isbn};

    // const filtered_book=books.filter((book)=>book.isbn===isbn);filter only for arrays
  //Write your code here
  return res.json({message: `book with isbn ${isbn}`,book:books[isbn]});
    }
    catch(error){
        console.log("Error",error);
        return res.status(500).json({message:"Internal Error"});
    }
 });
  // Async
  public_users.get('/books/isbn/:isbn',async (req,res) => {
    const isbn=req.params.isbn;
   try{

   if (!books[isbn]) {
      return res.status(404).json({ message: "Not Found with ISBN" });
  }
  const bookDetails=await new Promise((resolve)=>{
    resolve({...books[isbn],isbn});
  });
  return res.status(200).json({ message: `Book with ISBN ${isbn}`, book: bookDetails });
 }
  catch(error){
    return res.status(500).json({ message: "Internal Error" });

}
    
  })
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author=req.params.author;
  const bookByAuthor=Object.values(books).filter((book)=>book.author===author);
  return res.status(300).json({message: "book by author",book:bookByAuthor});
});
// Async
public_users.get('/books/author/:author',async (req, res)=> {
  //Write your code here
  try{
  const author=req.params.author;
  const bookByAuthor=await new Promise((resolve)=>{
    resolve(Object.values(books).filter((book)=>book.author===author))
  });
  return res.status(300).json({message: "book by author",book:bookByAuthor});
}
catch(error){
  return res.status(500).json({ message: "Internal Error" });

}
});
// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title=req.params.title;
  const bookbyTitle=Object.values(books).filter((book)=>book.title===title);
  return res.status(300).json({message: "book by author",book:bookbyTitle});
});
// Async
public_users.get('/books/title/:title',async (req, res) =>{
  //Write your code here
  try{
  const title=req.params.title;
  const bookbyTitle=await new Promise((resolve)=>{
    resolve(Object.values(books).filter((book)=>book.title===title))});
  return res.status(300).json({message: "book by author",book:bookbyTitle});
  }
  catch(error){
    return res.status(500).json({ message: "Internal Error" });
  
  }
});
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  const bookByReviews=books[isbn].reviews;
//   return res.status(300).json({message: "Book Reviews by isbn",book:bookByReviews});
return res.status(300).json({message: "book by author",reviews:bookByReviews});

});

module.exports.general = public_users;
