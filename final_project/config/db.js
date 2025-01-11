import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = process.env.MONGO_URL;

mongoose.connect(mongoUrl)
