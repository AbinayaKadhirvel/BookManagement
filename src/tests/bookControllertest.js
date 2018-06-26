const should = require('should');
const sinon = require('sinon');
const mongoose = require('mongoose');
const errorCode = require('../config/errorcodes');
const HttpStatus = require('http-status-codes');

const Book = require('../../models/bookModel.js');
const User = require('../../models/libraryUserModel');
const bookController = require('../controllers/bookController')();
let saveMock;

describe('Book App Controller Tests', () => {
  describe('Post', () => {
    it('should not allow a empty name on post', () => {
      const Book = () => {
        this.save = () => {};
      };

      const req = {
        body: {
          author: 'Test New',
        },
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
      };
      bookController.addNewBook(req, res);
      res.status.calledWith(HttpStatus.BAD_REQUEST).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
      res.send.calledWith(errorCode.TitleRequired).should.equal(true);
    });
  });
  describe('checkIfBookAddedByUser', () => {
    beforeEach((done) => {
      userMock = sinon.stub(User, 'findById');
      userMock.yields('',  { books: [ 12345 ] } );
      done();
    });
    afterEach(function(){
      userMock.restore();
    });

    let bookToReturn = [ {
      author: 'New Author',
      title: 'Test Book',
      genre: 'Comedy',
      _id: 12345,
      imageURL: 'url',
      bookaddedbyuser: false,
    }, {
      author: 'New Author1',
      title: 'Test Book1',
      genre: 'Comedy1',
      _id: 123456,
      imageURL: 'url',
      bookaddedbyuser: false,
    } ];

    it('Check if books added by user', () => {
      bookController.checkIfBookAddedByUser(
        { books: bookToReturn }
      ).then((books) => {
        books[0].bookaddedbyuser.should.equal(true);
        books[1].bookaddedbyuser.should.equal(false);
      })
        .catch((err) => {
          console.log(err);
        });
    });
    it('Check if books added by users are filtered', () => {
      bookController.checkIfBookAddedByUser(
        { books: bookToReturn, filter: true }
      ).then((books) => {
        books.should.be.an.Array.should.not.containEql(bookToReturn[1]);
        bookToReturn[0].bookaddedbyuser = true;
        books[0].should.containDeep(bookToReturn[0]);
      })
        .catch((err) => {
          console.log(err);
        });
    });
  });
  describe('Patch', () => {
    beforeEach((done) => {
      saveMock = sinon.stub(Book.prototype, 'save');
      done();
    });
    afterEach(function(){
      saveMock.restore();
    });
    it('should allow patch- edit single', () => {
      let bookToReturn = new Book({
        author: 'New Author',
        title: 'Test Book',
        genre: 'Comedy',
        _id: 12345,
        imageURL: 'url',
        bookaddedbyuser: false,
      });
      const req = {
        body: {
          _id: 12345,
          author: 'Test Author',
          imageURL: 'imageurl',
        },
        book: bookToReturn,
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      saveMock.yields('',  bookToReturn );
      bookController.updateOneBook(req, res);
      res.json.calledWith(bookToReturn).should.equal(true);
    });
  });
});
