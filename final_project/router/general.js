const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    if (isValid(username)) {
        return res.status(409).json({ message: "User already exists!" });
    }

    users.push({ username, password });
    return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
});

// Task 1 & Task 10: Get the book list available in the shop using Promise / async-await
public_users.get('/', async function (req, res) {
    try {
        const getBooks = new Promise((resolve) => {
            resolve(books);
        });
        const allBooks = await getBooks;
        return res.status(200).send(JSON.stringify(allBooks, null, 4));
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books", error: error.message });
    }
});

// Task 2 & Task 11: Get book details based on ISBN using Promise / async-await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const getBook = new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject({ status: 404, message: `Book with ISBN ${isbn} not found` });
            }
        });
        const book = await getBook;
        return res.status(200).json(book);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
});

// Task 3 & Task 12: Get book details based on author using Promise / async-await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = new Promise((resolve, reject) => {
            let matchingBooks = [];
            const isbns = Object.keys(books);
            isbns.forEach((isbn) => {
                if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
                    matchingBooks.push({
                        isbn: isbn,
                        title: books[isbn].title,
                        reviews: books[isbn].reviews
                    });
                }
            });
            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject({ status: 404, message: `No books found by author ${author}` });
            }
        });
        const result = await getBooksByAuthor;
        return res.status(200).json({ booksbyauthor: result });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
});

// Task 4 & Task 13: Get all books based on title using Promise / async-await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = new Promise((resolve, reject) => {
            let matchingBooks = [];
            const isbns = Object.keys(books);
            isbns.forEach((isbn) => {
                if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
                    matchingBooks.push({
                        isbn: isbn,
                        author: books[isbn].author,
                        reviews: books[isbn].reviews
                    });
                }
            });
            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject({ status: 404, message: `No books found with title ${title}` });
            }
        });
        const result = await getBooksByTitle;
        return res.status(200).json({ booksbytitle: result });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews);
    }
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
});

// ==============================================================================
// Task 10-13: Async/Await with Axios client implementations
// ==============================================================================
const BASE_URL = "http://localhost:5000";

// Task 10: Fetch all books using Axios and async/await
const getBookListAxios = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all books via Axios:", error.message);
        throw error;
    }
};

// Task 11: Fetch book by ISBN using Axios and async/await
const getBookByISBNAxios = async (isbn) => {
    try {
        const response = await axios.get(`${BASE_URL}/isbn/${isbn}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching book with ISBN ${isbn} via Axios:`, error.message);
        throw error;
    }
};

// Task 12: Fetch books by author using Axios and async/await
const getBookByAuthorAxios = async (author) => {
    try {
        const response = await axios.get(`${BASE_URL}/author/${author}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by author ${author} via Axios:`, error.message);
        throw error;
    }
};

// Task 13: Fetch books by title using Axios and async/await
const getBookByTitleAxios = async (title) => {
    try {
        const response = await axios.get(`${BASE_URL}/title/${title}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by title ${title} via Axios:`, error.message);
        throw error;
    }
};

module.exports.general = public_users;
module.exports.getBookListAxios = getBookListAxios;
module.exports.getBookByISBNAxios = getBookByISBNAxios;
module.exports.getBookByAuthorAxios = getBookByAuthorAxios;
module.exports.getBookByTitleAxios = getBookByTitleAxios;
