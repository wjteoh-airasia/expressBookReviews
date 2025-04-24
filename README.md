# Express Book Reviews API

A RESTful API for managing book reviews using Express.js, JWT authentication, and Promise/Async-Await patterns.

## Project Overview

This API allows users to:
- View a collection of books
- Search books by ISBN, author, or title
- Register and login to manage their book reviews
- Add, update, and delete their own book reviews

## Installation

1. Clone the repository:
```
git clone https://github.com/Erickalafita/expressBookReviews.git
```

2. Navigate to the project directory:
```
cd expressBookReviews/final_project
```

3. Install dependencies:
```
npm install
```

4. Start the server:
```
npm start
```

The server will run on port 3002 by default.

## API Endpoints

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | / | Get all books |
| GET | /isbn/:isbn | Get book by ISBN |
| GET | /author/:author | Get books by author |
| GET | /title/:title | Get books by title |
| GET | /review/:isbn | Get reviews for a book |
| POST | /register | Register a new user |

### Promise-based Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /books-promise | Get all books (Promise implementation) |
| GET | /isbn-promise/:isbn | Get book by ISBN (Promise implementation) |
| GET | /author-promise/:author | Get books by author (Promise implementation) |
| GET | /title-promise/:title | Get books by title (Promise implementation) |

### Async/Await with Axios Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /books-async | Get all books (Async/Await implementation) |
| GET | /isbn-async/:isbn | Get book by ISBN (Async/Await implementation) |
| GET | /author-async/:author | Get books by author (Async/Await implementation) |
| GET | /title-async/:title | Get books by title (Async/Await implementation) |

### Authenticated Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /customer/login | Login and get JWT token |
| PUT | /customer/auth/review/:isbn | Add or update a review for a book |
| DELETE | /customer/auth/review/:isbn | Delete a review for a book |

## Authentication

Authentication is implemented using JWT (JSON Web Tokens). To access protected routes:

1. Register a user with POST /register
2. Login with POST /customer/login to get a JWT token
3. Include the token in your requests to authenticated endpoints

## Examples

### Register a User
```
POST http://localhost:3002/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

### Login
```
POST http://localhost:3002/customer/login
Content-Type: application/json

{
  "username": "testuser", 
  "password": "password123"
}
```

### Add a Review (Authenticated)
```
PUT http://localhost:3002/customer/auth/review/1
Content-Type: application/json

{
  "review": "This book is excellent!"
}
```

## Technologies Used

- Node.js
- Express.js
- JWT for authentication
- Promises and Async/Await for asynchronous operations
- Axios for HTTP requests

## License

This project is licensed under the MIT License.
