const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const chai = require('chai');
const should = require('should');
const chaiHttp = require('chai-http');
<<<<<<< HEAD
const errorCode = require('../config/errorcodes');
=======
const HttpStatus = require('http-status-codes');
>>>>>>> 752a38d597618c3b4efb601ef80c366631433f70
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


describe('User Crud Test', () => {
  it('Should search for a book which is not listed', (done) => {

    agent.get('/books')
      .query({ searchby: 'title', searchterm: 'xyz' })
      .expect(HttpStatus.OK)
      .end((err, results) => {
        expect(results).to.be.html;
        const $ = cheerio.load(results.text);
        let noresulttext = $('.noresult').text();
        noresulttext.should.equal(errorCode.NoBookFoundOnSearch);
        done();
      });
  }).timeout(5000);

  it('Should search for a book', (done) => {
    if (bookid) {
      agent.get('/books')
        .query({ searchby: 'title', searchterm: 'new' })
        .expect(HttpStatus.OK)
        .end((err, results) => {


          expect(results).to.be.html;
          const $ = cheerio.load(results.text);
          let resultbookid = $('#bookid').attr('value');
          resultbookid.should.equal(bookid.toString());
          done();
        });
    }
  }).timeout(5000);

  it('Get the list of books and match the bookname added', (done) => {
    agent.get('/books')
      .expect(HttpStatus.OK)
      .end((err, results) => {
        expect(results).to.be.html;
        const $ = cheerio.load(results.text);
        const bookname = $('h3').text();
        bookname.should.equal('New book');
        done();
      });
  }).timeout(5000);

  it('Should edit a book with PUT method in body', (done) => {
    agent.post('/books/' + bookid)
      .send({
        author: 'New Author',
        title: 'New book',
        genre: 'Comedy',
        _method: 'PUT',
      })
      .expect(HttpStatus.OK)
      .end((err, results) => {
        expect(results).to.redirect;
        expect(results).to.redirectTo('/books/' + bookid);
        done();
      });
  }).timeout(5000);

  it('Should delete the book added', (done) => {

    agent.post('/books/' + bookid)
      .send({
        _method: 'DELETE',
      })
      .expect(HttpStatus.NO_CONTENT)
      .end(() => {
        done();
      });
  }).timeout(5000);

  it('List the single book requested', (done) => {

    agent.get('/books/' + bookid)
      .expect(HttpStatus.OK)
      .end((err, results) => {
        expect(results).to.be.html;
        const $ = cheerio.load(results.text);
        const bookname = $('h3').text();
        bookname.should.equal('New book');

        done();
      });
  }).timeout(5000);

  it('Should allow a book to be added and return a read and _id', (done) => {

    const newBook = { author: 'New Author', title: 'New book', genre: 'Comedy' };

    agent.post('/books')
      .send(newBook)
      .expect(HttpStatus.OK)
      .end((err, results) => {
        expect(results).to.redirect;
        expect(results).to.redirectTo('/books');
        done();
      });
  });
});
