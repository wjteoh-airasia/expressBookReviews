import express, { urlencoded } from 'express';
import dotenv from "dotenv";
import cors from "cors";
import "./config/db.js";
import jwt from 'jsonwebtoken';
import session from 'express-session';

import customer_route from "./router/auth_users.js";
import genl_routes from "./router/general.js"

const app = express();

app.use(express.json());
app.use(cors());
app.use(urlencoded({extended:true}));

app.use('/customer',customer_route);
app.use('/books',genl_routes);


const PORT =5000;
app.listen(PORT,"0.0.0.0",()=>console.log("Server is running"));
