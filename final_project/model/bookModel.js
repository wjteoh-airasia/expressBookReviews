import mongoose,{Schema}from "mongoose";

const reviewSchema = new mongoose.Schema({
    reviewer: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
});


const bookSchema = new mongoose.Schema({
    author:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    
    reviews:{
        type:[reviewSchema],
        required:true
    },
    ISBN:{
        type:Number,
        required:true
    },
});

const books = mongoose.model("books",bookSchema,"books");
export default books;