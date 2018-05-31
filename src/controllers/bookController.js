//const mongoose = require('mongoose');
const HttpStatus = require('http-status-codes');
const debug = require('debug')('app:bookController');

//const db = mongoose.connect('mongodb://localhost/libraryApp');
const Book = require('../../models/bookModel.js');
const nav = [
  { link: '/books', title: 'Book' },
];
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
          res.status(HttpStatus.NOT_FOUND).send('no book found');
        }
      });
    }
    else {
      res.redirect('/');
    }

  }
  function getIndex(req, res) {
    Book.find(req.query, (err, books) => {
      res.render(
        'bookListView',
        {
          nav,
          title: 'Library',
          books,
        }
      );
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
      }
    );
  }
  function addNewBook(req, res) {
    if (!req.body.title) {
      res.status(HttpStatus.BAD_REQUEST);
      return res.send('Title is required');
    }
    req.book.title = req.body.title;
    req.book.author = req.body.author;
    req.book.read = req.body.read;
    req.book.genre = req.body.genre;
    req.book.save((err) => {
      if (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      else {
        res.json(req.book);
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
        res.json(req.book);
      }
    });
  }
  function deleteBook(req, res) {
    debug(req.book);
    req.book.remove((err) => {
      if (err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(err);
      }
      else {
        res.status(HttpStatus.NO_CONTENT).send('Removed');
      }
    });
  }
  function postNew(req, res) {
    const newBook = new Book(req.body);
    if (!req.body.title) {
      res.status(HttpStatus.BAD_REQUEST);
      res.send('Title is required');
    }
    else {
      res.status(HttpStatus.CREATED);
      res.send(newBook);
    }
  }
  // Revealing Module Pattern
  return {
    getIndex,
    getById,
    middleware,
    postNew,
    addNewBook,
    updateOneBook,
    deleteBook,
  };
}

module.exports = bookController;
