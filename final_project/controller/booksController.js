import books from "../model/bookModel.js";

export async function getAllBooks(req,res){
    try{
        const al_books = await books.find({});
        res.status(200).json(al_books);
    }catch(error){
        console.error("Error fetching books:", error);
        res.status(500).json({message:"not found"});
    }
}
export async function getBooksIsbn(req,res){
    const isbn =parseInt(req.params.isbn,10);
    if (isbn){
        const isbn_books = await books.find({ISBN:isbn});
        res.status(200).json(isbn_books);
    }else{
        res.status(500).json({message:"not found"});
    }
}
export async function getBoooksbyAuthor(req,res){
    const aut = req.params.author;
    if (aut){
        const book = await books.find({author:aut});
        res.send(JSON.stringify(book,null,4));
    }else{
        res.status(500).json({message:"Pls specific author!"})
    }
}
export async function getBooksbyTitle(req,res) {
    const tit = req.params.title;
    if (tit){
        const book = await books.find({title:tit});
        res.status(200).json(book)
    }else{
        res.status(500).json({message:"Not found"})
    }
}
export async function getReviewbyisbn(req,res){
    const isbn =parseInt(req.params.isbn,10);
    if (isbn){
        const book = await books.find({ISBN:isbn});
        let review = "";
        book.forEach(element => {
            review = element.reviews;
        });
        res.status(200).json(review);
    }else{
        res.status(500).json({message:"Not found"})
    }
}