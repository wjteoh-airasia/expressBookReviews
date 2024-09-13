const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
	return users.some((user) => user.username === username.toLowerCase().trim());
};

const authenticatedUser = (username, password) => {
	if (!isValid(username)) {
		return false;
	}
	const resultUsername = users.find((user) => user.username === username);
	return resultUsername.password === password;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
	const { username, password } = req.body;
	if (authenticatedUser(username, password)) {
		const accessToken = jwt.sign({ username }, "secret_key", {
			expiresIn: "1h",
		});
		req.session.authorization = {
			accessToken,
			username,
		};
		return res.status(200).json({ message: "User successfully logged in." });
	} else {
		return res.status(401).json({ message: "Invalid username or password" });
	}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
	const review = req.query.review;
	const isbn = req.params.isbn;
	const user = req.session.authorization.username;
	let resultReviews = [];

	if (books[isbn].reviews.length > 0) {
		resultReviews = books[isbn].reviews;
		const indexUser = resultReviews.findIndex((r) => r.user === user);
		if (indexUser > -1) {
			books[isbn].reviews = [
				...resultReviews.slice(0, indexUser),
				...resultReviews.slice(indexUser + 1),
			];
		}
	}

	resultReviews.push({ user, review });
	books[isbn].reviews = resultReviews;
	return res
		.status(200)
		.json({ message: "Your review added.", reviews: books[isbn].reviews });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
	const isbn = req.params.isbn;
	const user = req.session.authorization.username;
	let resultReviews = [];

	if (books[isbn].reviews.length > 0) {
		resultReviews = books[isbn].reviews;
		const indexUser = resultReviews.findIndex((r) => r.user === user);
		if (indexUser > -1) {
			books[isbn].reviews = [
				...resultReviews.slice(0, indexUser),
				...resultReviews.slice(indexUser + 1),
			];
		}
	}
	return res
		.status(200)
		.json({ message: "Your review deleted.", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
