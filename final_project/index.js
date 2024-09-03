const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const crypto = require("crypto");
const login_session_secret = require("./router/auth_users.js").logSec;

const app = express();

const rout_session_secret = crypto.randomBytes(64).toString("hex");

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: rout_session_secret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  //Write the authenication mechanism here
  if (req.session.authorization && req.session.authorization.JW_Token) {
    let token = req.session.authorization.JW_Token;

    jwt.verify(token, login_session_secret, (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ massage: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not authenticated" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
