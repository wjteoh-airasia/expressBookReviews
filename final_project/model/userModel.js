import mongoose, {Schema}from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Book:{
        type:Object,
        required:false
    }
});
const customer = mongoose.model("customer",userSchema,"customer");

export default customer;
