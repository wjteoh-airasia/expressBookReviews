const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();

public_users.post("/register", (req, res) => {
	if (!req.body.username || !req.body.password) {
		return res.status(401).json({
			message: "Invalid username or password",
		});
	}
	if (isValid(req.body.username)) {
		return res.status(200).json({
			message:
				"User with this username is registered. please choose another username or login.",
		});
	}
	const newUser = {
		username: req.body.username.toLowerCase(),
		password: req.body.password,
	};
	users.push(newUser);
	return res.status(200).json({
		message: "User registration successful.",
	});
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
	return res.status(200).json(books);
});

public_users.get("/api", async function (req, res) {
	try {
		const booksList = await axios.get("http://localhost:5000");
		const bookResults = booksList.data;
		return res.status(200).json(bookResults);
	} catch (err) {
		console.error("Error:", err.toString());
		res.status(500).send("Server Error. Please try again later.");
	}
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
	return res.status(200).json(books[req.params.isbn]);
});

public_users.get("/api/isbn/:isbn", async function (req, res) {
	try {
		const booksList = await axios.get("http://localhost:5000");
		const bookResults = booksList.data;
		return res.status(200).json(bookResults[req.params.isbn]);
	} catch (err) {
		console.error("Error:", err.toString());
		res.status(500).send("Server Error. Please try again later.");
	}
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
	const author = req.params.author;
	let result = [];
	const booksArray = Object.keys(books);
	for (let i = 0; i < booksArray.length; i++) {
		if (
			books[booksArray[i]].author.toLowerCase().includes(author.toLowerCase())
		) {
			result.push(books[booksArray[i]]);
		}
	}
	return res.status(200).json(result);
});

public_users.get("/api/author/:author", async function (req, res) {
	try {
		const booksList = await axios.get("http://localhost:5000");
		const bookResults = booksList.data;
		const author = req.params.author;
		let result = [];
		const booksArray = Object.keys(bookResults);
		for (let i = 0; i < booksArray.length; i++) {
			if (
				bookResults[booksArray[i]].author
					.toLowerCase()
					.includes(author.toLowerCase())
			) {
				result.push(bookResults[booksArray[i]]);
			}
		}
		return res.status(200).json(result);
	} catch (err) {
		console.error("Error:", err.toString());
		res.status(500).send("Server Error. Please try again later.");
	}
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
	const title = req.params.title;
	let result = [];
	const booksArray = Object.keys(books);
	for (let i = 0; i < booksArray.length; i++) {
		if (
			books[booksArray[i]].title.toLowerCase().includes(title.toLowerCase())
		) {
			result.push(books[booksArray[i]]);
		}
	}
	return res.status(200).json(result);
});

public_users.get("/api/title/:title", async function (req, res) {
	try {
		const booksList = await axios.get("http://localhost:5000");
		const bookResults = booksList.data;
		const author = req.params.title;
		let result = [];
		const booksArray = Object.keys(bookResults);
		for (let i = 0; i < booksArray.length; i++) {
			if (
				bookResults[booksArray[i]].title
					.toLowerCase()
					.includes(title.toLowerCase())
			) {
				result.push(bookResults[booksArray[i]]);
			}
		}
		return res.status(200).json(result);
	} catch (err) {
		console.error("Error:", err.toString());
		res.status(500).send("Server Error. Please try again later.");
	}
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
	return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
