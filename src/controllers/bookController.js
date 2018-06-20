//const mongoose = require('mongoose');
const HttpStatus = require('http-status-codes');
const debug = require('debug')('app:bookController');
const errorCode = require('../config/errorcodes');
const bookPersistence = require('./bookPersistence');
//const db = mongoose.connect('mongodb://localhost/libraryApp');
const Book = require('../../models/bookModel.js');
const nav = [
  { link: '/books', title: 'Book' },
];
const genrelist = require('../config/genrelist');
function bookController() {
  function middleware(req, res, next) {
    bookPersistence.GetBookByID(req.params.bookId, function(result) {
      if (result.error) {
        res.status(result.errorCode).send(result.error);
      }
      else {
        req.book = result.data;
        next();
      }
    });

  }
  function getAll(req, res) {
    bookPersistence.SearchBooks(req.query, function (results) {
      if (results.errorCode === HttpStatus.INTERNAL_SERVER_ERROR) {
        res.status(result.errorCode).send(result.error);
      }
      else if (results.error) {
        res.render(
          'bookListView',
          {
            nav,
            title: 'Library',
            noresult: '1',
            books: {},
            book: {},
            genrelist,
            errorCode,
          }
        );
      }
      else {
        res.render(
          'bookListView',
          {
            nav,
            noresult: '0',
            title: 'Library',
            books: results.data,
            book: {},
            genrelist,
            errorCode,
          }
        );
      }
    });

  }
  function getById(req, res) {
    book = req.book;
    res.render(
      'bookView',
      {
        nav,
        title: 'Library',
        book,
        genrelist,
        errorCode,
      }
    );
  }
  function addNewBook(req, res) {
    if (!req.body.title) {
      res.status(HttpStatus.BAD_REQUEST);
      return res.send(errorCode.TitleRequired);
    }
    req.book.title = req.body.title;
    req.book.author = req.body.author;
    req.book.read = req.body.read;
    req.book.genre = req.body.genre;
    req.book.description = req.body.description;
    req.book.imageURL = req.body.imageURL;
    bookPersistence.PersistBook(req.book, (results) => {
      if (results.error) {
        res.status(results.errorCode).send(results.error);
      }
      else {
        res.redirect('/books/' + results.data._id);
      }
    });
  }
  function updateOneBook(req, res) {
    if (req.body._id) {
      delete req.body._id;
    }
    for (const property in req.body) {
      req.book[property] = req.body[property];
    }
    bookPersistence.PersistBook(req.book, (results) => {
      if (results.error) {
        res.status(results.errorCode).send(error);
      }
      else {
        res.status(HttpStatus.CREATED);
        res.json(results.data);
      }
    });
  }
  function deleteBook(req, res) {
    req.book.remove((err) => {
      if (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      else {
        res.status(HttpStatus.NO_CONTENT).send();
      }
    });
  }
  function postNew(req, res) {
    debug(req.body);
    const newBook = new Book(req.body);
    if (!req.body.title) {
      res.status(HttpStatus.BAD_REQUEST).send(errorCode.TitleRequired);
    }
    else {
      bookPersistence.PersistBook(newBook, (results) => {
        if (results.error) {
          res.status(results.errorCode).send(error);
        }
        else {
          res.status(HttpStatus.CREATED);
          res.redirect('/books');
        }
      });
    }
  }
  // Revealing Module Pattern
  return {
    getAll,
    getById,
    middleware,
    postNew,
    addNewBook,
    updateOneBook,
    deleteBook,
  };
}

module.exports = bookController;
