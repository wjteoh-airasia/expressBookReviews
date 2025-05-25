const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: 'testuser', password: 'testpass123' }
];

const isValid = (username) => {
  return username && username.trim().length >= 3 && username.trim().length <= 30;
}

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username);
  return user && user.password === password;
}

// Only registered users can login
regd_users.post("/login", (req, res) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));
    
    const { username, password } = req.body;
    console.log('Extracted username:', username);
    console.log('Extracted password:', password ? '***' : 'undefined');

    // Validate input
    if (!username || !password) {
      const errorMsg = !username && !password ? 'Username and password are required' : 
                         !username ? 'Username is required' : 'Password is required';
      console.log('Validation failed:', errorMsg);
      return res.status(400).json({ message: errorMsg });
    }

    console.log('Users in database:', JSON.stringify(users, null, 2));
    console.log('Checking authentication for user:', username);
    
    if (!authenticatedUser(username, password)) {
      console.log('Authentication failed: Invalid credentials');
      return res.status(401).json({ message: "Invalid username or password" });
    }
    
    console.log('Authentication successful for user:', username);

    // Create JWT token
    const token = jwt.sign(
      { username: username },
      process.env.JWT_SECRET || 'your-security-key',
      { expiresIn: "1h" }
    );
    
    console.log('JWT token generated');
    
    // Store user in session
    req.session.user = { username };
    console.log('User session created:', req.session.user);
    
    // Prepare response
    const response = {
      message: "Login successful",
      token: token,
      username: username
    };
    
    console.log('Sending response:', JSON.stringify(response, null, 2));
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: "Internal server error during login",
      error: error.message 
    });
  }
});

// Function to handle book review logic (used by both GET and PUT routes)
const handleReview = (req, res) => {
  try {
    // Get the ISBN from the URL parameter
    const isbn = req.params.isbn;
    
    // Get the review text from the query parameter
    const reviewText = req.query.review;
    
    // Log the received data for debugging
    console.log(`Received review request - Method: ${req.method}, ISBN: ${isbn}, Review: ${reviewText}`);
    console.log('Session data:', req.session);
    console.log('User data:', req.user);
    
    // Validate that review text is provided
    if (!reviewText || reviewText.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: "Review text is required as a query parameter" 
      });
    }
    
    // Validate that the book exists
    if (!books[isbn]) {
      return res.status(404).json({ 
        success: false, 
        message: "Book not found with the provided ISBN" 
      });
    }
    
    // Get the username from the session or JWT token
    // First check if we have a user from JWT verification
    let username;
    if (req.user && req.user.username) {
      username = req.user.username;
    } 
    // Then check if we have a user in the session
    else if (req.session && req.session.user && req.session.user.username) {
      username = req.session.user.username;
    } 
    // Fallback to anonymous if no user info is available
    else {
      username = 'anonymous';
    }
    
    console.log(`User '${username}' is adding/modifying a review for book ISBN: ${isbn}`);
    
    // Initialize the reviews object for this book if it doesn't exist
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
    
    // Check if this user already has a review for this book
    const previousReview = books[isbn].reviews[username];
    const isUpdate = !!previousReview;
    
    // Create or update the review
    books[isbn].reviews[username] = {
      text: reviewText,
      timestamp: new Date().toISOString()
    };
    
    // Prepare success message based on whether this is a new review or an update
    const message = isUpdate 
      ? "Review updated successfully" 
      : "Review added successfully";
    
    // Return the response with the review details
    return res.status(200).json({
      success: true,
      message: message,
      book: {
        isbn: isbn,
        title: books[isbn].title,
        author: books[isbn].author
      },
      review: {
        username: username,
        text: reviewText,
        timestamp: books[isbn].reviews[username].timestamp,
        isUpdate: isUpdate
      },
      allReviews: books[isbn].reviews
    });
  } catch (error) {
    // Log and handle any errors
    console.error("Error processing review:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Error processing your review", 
      error: error.message 
    });
  }
};

// Register both GET and PUT routes for the review endpoint
// GET route for adding/modifying a review
regd_users.get("/auth/review/:isbn", handleReview);

// PUT route for adding/modifying a review (same handler function)
regd_users.put("/auth/review/:isbn", handleReview);

// Also register the routes without the 'auth' prefix for flexibility
regd_users.get("/review/:isbn", handleReview);
regd_users.put("/review/:isbn", handleReview);

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;