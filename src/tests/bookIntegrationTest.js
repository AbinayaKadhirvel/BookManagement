const should = require('should');
const sinon = require('sinon');
const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const cheerio = require('cheerio');

const Book = mongoose.model('Book');
const agent = request.agent(app);

describe('User Crud Test', () => {

  it('Should allow a user to be added and return a read and _id', (done) => {
    beforeEach((done) => {
      Book.remove().exec();
      done();
    });
    const newBook = { author: 'New Author', title: 'New book', genre: 'Comedy' };

    agent.post('/books')
      .send(newBook)
      .expect(200)
      .end((err, results) => {
        /*results = {
          render: sinon.spy(),
        };*/
        const $ = cheerio.load(results.request.url);
        // let query = {};
        // query.author = 'New book';
        // Book.find(query, (err, books) => {
        //   console.log(books);
        // });
        //console.log(results.request);
        //console.log($);
        //const bookName = $('h3');
        //bookName.should.equal('New book');
        //console.log(bookName);
        done();
      });
  });

  it('Get the list of books and match the bookname added', (done) => {
    agent.get('/books')
      .expect(200)
      .end((err, results) => {
        //console.log(results.text);
        const $ = cheerio.load(results.text);
        const bookname = $('h3').text();
        bookname.should.equal('New book');
        done();
      });
  }).timeout(5000);
});


