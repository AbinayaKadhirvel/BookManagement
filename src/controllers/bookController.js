//const mongoose = require('mongoose');
const HttpStatus = require('http-status-codes');
const debug = require('debug')('app:bookController');
const errorCode = require('../config/errorcodes');

//const db = mongoose.connect('mongodb://localhost/libraryApp');
const Book = require('../../models/bookModel.js');
const nav = [
  { link: '/books', title: 'Book' },
];
const genrelist = require('../config/genrelist');
function bookController() {
  function middleware(req, res, next) {
    if (req.params.bookId) {
      Book.findById(req.params.bookId, (err, book) => {
        if (err) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
        }
        else if (book) {
          req.book = book;
          next();
        }
        else {
          res.status(HttpStatus.NOT_FOUND).send(errorCode.NoBookFound);
        }
      });
    }
    else {
      res.redirect('/');
    }

  }
  function getAll(req, res) {
    searchby = req.query.searchby;
    query = {};
    querysearchparam = {
      $regex: req.query.searchterm,
      $options: 'i',
    };
    if (searchby === 'author') {
      query.author = querysearchparam;
    }
    if (searchby === 'title') {
      query.title = querysearchparam;
    }
    if (searchby === 'genre') {
      query.genre = querysearchparam;
    }
    Book.find(query, (err, books) => {
      debug(books);
      if (books[0]) {
        res.render(
          'bookListView',
          {
            nav,
            title: 'Library',
            books,
            noresult: '0',
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
            title: 'Library',
            noresult: '1',
            books: {},
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
    debug(req.book);
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
    req.book.save((err, book) => {
      if (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      else {
        res.redirect('/books/' + book._id);
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
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
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
      newBook.save((err) => {
        if (err) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
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
