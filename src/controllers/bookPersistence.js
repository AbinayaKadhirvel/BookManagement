const HttpStatus = require('http-status-codes');
const debug = require('debug')('app:bookPersistence');
const errorCode = require('../config/errorcodes');
const faker = require('faker');
const Book = require('../../models/bookModel.js');

module.exports = {
  GetBookByID: (bookid, callback) => {
    callback = callback || (() => {});
    if (bookid) {
      Book.findById(bookid, (err, book) => {
        if (err) {
          callback({
            error: err,
            errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
          });
        }
        else if (book) {
          callback({
            error: '',
            data: book,
          });
        }
        else {
          callback({
            error: errorCode.NoBookFound,
            errorCode: HttpStatus.NOT_FOUND,
          });
        }
      });
    }
    else {
      callback({
        error: errorCode.NoBookRequested,
        errorCode: HttpStatus.BAD_REQUEST,
      });
    }
  },
  SearchBooks: (searchQuery, callback) => {

    debug(searchQuery);
    callback = callback || (() => {});
    let searchby = searchQuery.searchby;
    let query = {};
    let querysearchparam = {
      $regex: searchQuery.searchterm,
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
      if (books[0]) {
        return callback({
          error: '',
          data: books,
        });
      }
      else {
        return callback({
          error: errorCode.NoBookFoundOnSearch,
          data: [],
        });

      }

    });
  },
  PersistBook: (book, callback) => {
    book.imageURL = book.imageURL || faker.image.avatar();
    book.save((err, book) => {
      if (err) {
        return callback({
          errorCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: err,
        });
      }
      else {
        return callback({
          data: book,
          error: '',
        });
      }
    });
  },
};

