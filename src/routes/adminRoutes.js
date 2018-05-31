const express = require('express');
//const mongoose = require('mongoose');

//const db = mongoose.connect('mongodb://localhost/libraryApp');
//const Book = require('../../models/bookModel.js');
const debug = require('debug')('app:adminRoutes');

const adminRouter = express.Router();

const books = [ {
  title: 'War and Peace',
  genre: 'Historical Fiction',
  author: 'Lev Nikolayevich Tolstoy',
  bookId: 656,
  read: false,
}, {
  title: 'Les Miserables',
  genre: 'Historical Fiction',
  author: 'Victor Hugo',
  bookId: 24280,
  read: false,
}, {
  title: 'A Journey into the Center of the Earth',
  gener: 'Science Fiction',
  author: 'Jules Verne',
  read: false,
}, {
  title: 'The Time Machine',
  genre: 'Science Fiction',
  author: 'H. G. Wells',
  read: false,
}, {
  title: 'The Dark World',
  genre: 'Fantasy',
  author: 'Henry Kuttner',
  read: false,
}, {
  title: 'The Wind in the Willows',
  genre: 'Fantasy',
  author: 'Kenneth Grahame',
  read: false,
} ];

function router() {
  adminRouter.route('/')
    .get(() => {
      collection.insert(books,  (err, insertedbooks) => {
        if (err) {
          debug(err);
        }
        else {
          debug(insertedbooks.length);
        }
      });
    });
  return adminRouter;
}

module.exports = router;
