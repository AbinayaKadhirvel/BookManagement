const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const chai = require('chai');

const chaiHttp = require('chai-http');
const errorCode = require('../config/errorcodes');
const HttpStatus = require('http-status-codes');
//const Book = require('../../models/bookModel.js');


let bookid;
chai.use(chaiHttp);

const expect = chai.expect;

const Book = mongoose.model('Book');

const agent = request.agent(app);
after(function() {
  // runs after all tests in this block
  mongoose.connection.close(function(){
    done();
  });
});

beforeEach((done) => {
  Book.remove().exec();
  const newBook = new Book({ author: 'New Author', title: 'New book', genre: 'Comedy' });
  newBook.save((err, book) => {
    if (err) {
      debug(err);
    }
    else {
      bookid = book._id;
      done();
    }
  });
});


describe('User Crud Test for BookAPI', () => {
  it('Should search for a book which is not listed', (done) => {

    agent.get('/bookAPI')
      .query({ searchby: 'title', searchterm: 'xyz' })
      .expect(HttpStatus.OK)
      .end((err) => {
        done();
      });
  }).timeout(5000);

  it('Should search for a book', (done) => {
    if (bookid) {
      agent.get('/bookAPI')
        .query({ searchby: 'title', searchterm: 'new' })
        .expect(HttpStatus.OK)
        .end((err, results) => {
          expect(results).to.be.json;
          expect(results.body[0]).to.have.property('title', 'New book');
          done();
        });
    }
  }).timeout(5000);

  it('Get the list of books and match the bookname added', (done) => {
    agent.get('/bookAPI')
      .expect(HttpStatus.OK)
      .end((err, results) => {
        expect(results).to.be.json;
        expect(results.body[0]).to.have.property('title', 'New book');
        done();
      });
  }).timeout(5000);

  it('Should put book', (done) => {
    agent.put('/bookAPI/' + bookid)
      .send({
        author: 'New AuthorPut',
        title: 'New bookPut',
        genre: 'Comedy',
      })
      .expect(HttpStatus.OK)
      .end((err, results) => {
        expect(results).to.be.json;
        expect(results.body).to.have.property('title', 'New bookPut');
        done();
      });
  }).timeout(5000);

  it('Should delete the book added', (done) => {

    agent.delete('/bookAPI/' + bookid)
      .expect(HttpStatus.NO_CONTENT)
      .end(() => {
        done();
      });
  }).timeout(5000);

  it('List the single book requested', (done) => {

    agent.get('/bookAPI/' + bookid)
      .expect(HttpStatus.OK)
      .end((err, results) => {
        expect(results.body).to.have.property('title', 'New book');
        done();
      });
  }).timeout(5000);

  it('Should allow a book to be added and return a read and _id', (done) => {

    const newBook = { author: 'New Author Post', title: 'New book post', genre: 'Comedy' };

    agent.post('/bookAPI')
      .send(newBook)
      .expect(HttpStatus.OK)
      .end((err, results) => {
        expect(results).to.be.json;
        expect(results.body).to.have.property('title', 'New book post');
        done();
      });
  });
  it('Should not allow a book to be added if title is missing', (done) => {

    const newBook = { author: 'New Author Post', genre: 'Comedy' };

    agent.post('/bookAPI')
      .send(newBook)
      .expect(HttpStatus.BAD_REQUEST)
      .end((err, results) => {
        expect(results.error.text).to.equal(errorCode.TitleRequired);
        done();
      });
  });
});
