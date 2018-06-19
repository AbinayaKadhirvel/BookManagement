const should = require('should');
const sinon = require('sinon');
const mongoose = require('mongoose');
const errorCode = require('../config/errorcodes');
const Book = require('../../models/bookModel.js');
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

      const bookController = require('../controllers/bookController')(Book);
      bookController.addNewBook(req, res);
      res.status.calledWith(400).should.equal(true, `Bad Status ${res.status.args[0][0]}`);
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
        read: false,
        genre: 'Comedy',
        _id: 12345,
      });
      const req = {
        body: {
          _id: 12345,
          author: 'Test Author',
        },
        book: bookToReturn,
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };

      const bookController = require('../controllers/bookController')(Book);
      saveMock.yields('', { bookToReturn });
      bookController.updateOneBook(req, res);
      res.json.calledWith(bookToReturn).should.equal(true);
    });
  });
});
