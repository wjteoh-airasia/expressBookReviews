# Book Review Application - Backend

This project is a simple Bookshop API built with Express.js. It allows users to register, login, view books, and add or delete reviews for books.

## Project Structure

## Installation

1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Navigate to the project directory:
    ```sh
    cd final_project
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```

## Running the Project

To start the server, run:
```sh
npm start
```
The server will start on port 5000.

## API EndPoints

### Public Endpoints
- **POST `/register`** : Register a new user.
- **GET `/`** : Get the list of all books.
- **GET `/isbn/:isbn`** : Get book details based on ISBN.
- **GET `/author/:author`** : Get book details based on author.
- **GET `/title/:title`** : Get book details based on title.
- **GET `/review/:isbn`** : Get reviews for a book based on ISBN.

### Authenticated Endpoints
- **POST `/customer/login`** : Login a registered user.
- **PUT `/customer/auth/review/:isbn`** : Add or modify a book review.
- **DELETE `/customer/auth/review/:isbn`** : Delete a book review.

## Authentication
The project uses JWT for authentication. Users need to login to access the authenticated endpoints.
