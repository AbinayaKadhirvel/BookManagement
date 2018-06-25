const should = require('should');
const sinon = require('sinon');
const mongoose = require('mongoose');
const errorCode = require('../config/errorcodes');
const HttpStatus = require('http-status-codes');

const Book = require('../../models/bookModel.js');
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
