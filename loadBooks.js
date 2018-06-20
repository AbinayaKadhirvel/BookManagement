
const mongoose = require('mongoose');
const bookservice = require('./src/services/goodreadsService');
const db = mongoose.connect('mongodb://localhost/libraryApp');
const Book = require('./models/bookModel.js');

let books = [ {
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
  bookId: 32829,
}, {
  title: 'The Time Machine',
  genre: 'Science Fiction',
  author: 'H. G. Wells',
  bookId: 2493,
  read: false,
}, {
  title: 'The Dark World',
  genre: 'Fantasy',
  author: 'Henry Kuttner',
  bookId: 1881716,
  read: false,
}, {
  title: 'The Wind in the Willows',
  genre: 'Fantasy',
  author: 'Kenneth Grahame',
  bookId: 5659,
  read: false,
} ];

function loadData() {

  Book.remove().exec();
  books.forEach(function(element) {
    bookservice.getBookById(element.bookId).then(function (results) {
      element.description = results.description;
      element.imageURL = results.image_url;
      Book.collection.insert(element, (err, insertedbooks) => {
        if (err) {
          throw (err);
        }
        else {
          console.log(insertedbooks);
        }
      });
    }, function (error) {
      throw error;
    });


  });

}
loadData();

