import express from 'express';
import jwt from 'jsonwebtoken';
import * as userController from "../controller/userController.js";
import session from 'express-session';

const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean

//write code to check if username and password match the one we have in records.
}


regd_users.post("/register",userController.regisUser);
regd_users.post("/login", (req,res,next)=>{
  if(req.session.authorization){
    console.log("pass authorized first in auth_user");
    let token = req.session.authorization['accessToken'];
    jwt.verify(token, "access", (err, user) => {
      console.log("in jwt verify");
      if (!err) {        
          console.log("pass jwt");
          req.user = user; // Set authenticated user data on the request object
          next(); // Proceed to the next middleware
      } else {
          return res.status(403).json({ message: "User not authenticated" }); // Return error if token verification fails
      }
    });
  }
},userController.loginUser);
regd_users.post("/logout",userController.logoutUser);
regd_users.put("/review/:isbn",userController.userReview);

export default regd_users;
