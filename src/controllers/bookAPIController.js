//const mongoose = require('mongoose');
const HttpStatus = require('http-status-codes');
const debug = require('debug')('app:bookController');
const errorCode = require('../config/errorcodes');
const bookPersistence = require('./bookPersistence');
//const db = mongoose.connect('mongodb://localhost/libraryApp');
const Book = require('../../models/bookModel.js');
const validator = require('../validator/bookValidator');

function bookAPIController() {
  function middleware(req, res, next) {
    validator.validateBookId(req.params.bookId, function(bookResult) {
      if (bookResult.bookID && bookResult.err === '') {
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
      else {
        res.status(HttpStatus.BAD_REQUEST).send(bookResult.err);
      }
    });
  }
  function getAll(req, res) {
    bookPersistence.SearchBooks(req.query, function (results) {
      if (results.errorCode === HttpStatus.INTERNAL_SERVER_ERROR) {
        res.status(result.errorCode).send(result.error);
      }
      else if (results.error) {
        res.status(HttpStatus.NOT_FOUND).send();
      }
      else {
        res.status(HttpStatus.OK).json(results.data);
      }
    });

  }
  function getById(req, res) {
    book = req.book;
    res.status(HttpStatus.OK).send(book);
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
    bookPersistence.PersistBook(req.book, (results) => {
      if (results.error) {
        res.status(results.errorCode).send(results.error);
      }
      else {
        res.status(HttpStatus.OK).json(results.data);
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
    req.book.save((err) => {
      if (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorCode.BookUpdateFailed);
      }
      else {
        res.status(HttpStatus.CREATED);
        res.json(req.book);
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
    const newBook = new Book(req.body);
    if (!req.body.title) {
      res.status(HttpStatus.BAD_REQUEST).send(errorCode.TitleRequired);
    }
    else {
      newBook.save((err, book) => {
        if (err) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorCode.BookUpdateFailed);
        }
        else {
          res.status(HttpStatus.CREATED).json(book);
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

module.exports = bookAPIController;
