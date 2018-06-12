const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const cheerio = require('cheerio');
const chai = require('chai');
const chaiHttp = require('chai-http');
//const Book = require('../../models/bookModel.js');


let bookid;
chai.use(chaiHttp);

const expect = chai.expect;

const Book = mongoose.model('Book');
const agent = request.agent(app);

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
      .expect(200)
      .end((err, results) => {
        expect(results).to.be.html;
        const $ = cheerio.load(results.text);
        let noresulttext = $('.noresult').text();
        noresulttext.should.equal('No Books matching your searchterm.');
        done();
      });
  }).timeout(5000);
  it('Should search for a book', (done) => {
    if (bookid) {
      agent.get('/books')
        .query({ searchby: 'title', searchterm: 'new' })
        .expect(200)
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
      .expect(200)
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
      .expect(200)
      .end((err, results) => {
        expect(results).to.be.html;
        const $ = cheerio.load(results.text);
        let resultbookid = $('#bookid').attr('value');
        resultbookid.should.equal(bookid.toString());
        done();
      });
  }).timeout(5000);
  it('Should allow a book to be added and return a read and _id', (done) => {

    const newBook = { author: 'New Author', title: 'New book', genre: 'Comedy' };

    agent.post('/books')
      .send(newBook)
      .expect(200)
      .end((err, results) => {
        expect(results).to.redirect;
        expect(results).to.redirectTo('/books');
        //console.log(results);
        done();
      });
  });
});


