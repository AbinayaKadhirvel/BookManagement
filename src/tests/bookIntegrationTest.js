const should = require('should');
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');

const Book = mongoose.model('Book');
const agent = request.agent(app);

describe('User Crud Test', () => {
  it('Should allow a user to be added and return a read and _id', (done) => {
    const newBook = { author: 'New Author', title: 'New book', genre: 'Comedy' };

    agent.post('/books')
      .send(newBook)
      .expect(200)
      .end((err, results) => {
        results.body.read.should.equal(false);
        results.body.should.have.property('_id');
        done();
      });

    afterEach((done) => {
      Book.remove().exec();
      done();
    });
  });
});
