const axios = require('axios');

const baseURL = 'http://localhost:5000';

// GET all books using axios
async function getAllBooksAxios() {
    try {
        const response = await axios.get(`${baseURL}/`);
        console.log("All Books:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching all books:", error.message);
        throw error;
    }
}

// GET book by ISBN using axios
async function getBookByISBNAxios(isbn) {
    try {
        const response = await axios.get(`${baseURL}/isbn/${isbn}`);
        console.log(`Book with ISBN ${isbn}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching book by ISBN ${isbn}:`, error.message);
        throw error;
    }
}

// GET books by author using axios
async function getBooksByAuthorAxios(author) {
    try {
        const response = await axios.get(`${baseURL}/author/${author}`);
        console.log(`Books by ${author}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by author ${author}:`, error.message);
        throw error;
    }
}

// GET books by title using axios
async function getBooksByTitleAxios(title) {
    try {
        const response = await axios.get(`${baseURL}/title/${title}`);
        console.log(`Books with title '${title}':`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by title '${title}':`, error.message);
        throw error;
    }
}

// POST register user using axios
async function registerUserAxios(username, password) {
    try {
        const response = await axios.post(`${baseURL}/register`, {
            username: username,
            password: password
        });
        console.log("User Registration:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error registering user:", error.message);
        throw error;
    }
}

// POST login user using axios
async function loginUserAxios(username, password) {
    try {
        const response = await axios.post(`${baseURL}/customer/login`, {
            username: username,
            password: password
        });
        console.log("User Login:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error logging in user:", error.message);
        throw error;
    }
}

// PUT add/modify book review using axios (requires authentication)
async function addBookReviewAxios(isbn, review, sessionCookie) {
    try {
        const response = await axios.put(`${baseURL}/customer/auth/review/${isbn}`, {
            review: review
        }, {
            headers: {
                'Cookie': sessionCookie
            }
        });
        console.log(`Review for book ISBN ${isbn}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error adding review for book ISBN ${isbn}:`, error.message);
        throw error;
    }
}

// DELETE book review using axios (requires authentication)
async function deleteBookReviewAxios(isbn, sessionCookie) {
    try {
        const response = await axios.delete(`${baseURL}/customer/auth/review/${isbn}`, {
            headers: {
                'Cookie': sessionCookie
            }
        });
        console.log(`Delete review for book ISBN ${isbn}:`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error deleting review for book ISBN ${isbn}:`, error.message);
        throw error;
    }
}

// Export all functions
module.exports = {
    getAllBooksAxios,
    getBookByISBNAxios,
    getBooksByAuthorAxios,
    getBooksByTitleAxios,
    registerUserAxios,
    loginUserAxios,
    addBookReviewAxios,
    deleteBookReviewAxios
};

// Example usage (uncomment to test when server is running):
/*
async function testAxiosOperations() {
    try {
        // Test GET operations
        await getAllBooksAxios();
        await getBookByISBNAxios('1');
        await getBooksByAuthorAxios('Jane Austen');
        await getBooksByTitleAxios('Pride and Prejudice');
        
        // Test POST operations
        await registerUserAxios('testuser', 'testpass');
        await loginUserAxios('testuser', 'testpass');
        
        // Note: For authenticated operations, you would need to handle session cookies
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

// Uncomment to run tests:
// testAxiosOperations();
*/ 