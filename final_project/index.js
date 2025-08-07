const express = require("express");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const customer_routes = require("./router/auth_users.js").authenticated;
const genl_routes = require("./router/general.js").general;
const cors = require("cors");
const { users } = require("./router/auth_users.js");

const app = express();

app.use(express.json());

app.get("/users", (req, res) => {
    return res.status(200).json({
        users,
    });
});

app.use(
    "/customer",
    session({
        secret: "fingerprint_customer",
        resave: true,
        saveUninitialized: true,
    })
);

app.use("/customer/auth/*", function auth(req, res, next) {
    if (!req.session.authorization) {
        return res.status(403).json({ message: "User not logged in" });
    }

    const token = req.session.authorization.accessToken;

    jwt.verify(token, "fingerprint", (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);
app.use(cors());

app.listen(PORT, () => console.log("Server is running"));
