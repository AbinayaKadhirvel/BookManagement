const should = require('should');
const sinon = require('sinon');

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
      res.send.calledWith('Title is required').should.equal(true);
    });
  });
});
