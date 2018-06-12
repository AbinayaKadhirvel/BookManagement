const should = require('should');
const sinon = require('sinon');
const mongoose = require('mongoose');
const User = require('../../models/libraryUserModel.js');
let testusername = 'TestUser';
const authController = require('../controllers/authController');
let storeMock, saveMock;
const { signUpPage, addNewUser, signInPage, authenticateUser } = authController();
describe('Auth Controller Tests', () => {
  describe('addNewUser', () => {
    beforeEach(function() {
      findOneMock = sinon.stub(User, 'findOne');
      saveMock = sinon.stub(User.prototype, 'save');
    });
    afterEach(function(){
      findOneMock.restore();
      saveMock.restore();
    });
    it('should not allow a user to be created if user already exists', (done) => {
      const req = {
        body: {
          username: testusername,
        },
      };
      const res = {
        redirect: sinon.spy(),
      };

      findOneMock.yields('', { username: 'userexists' });
      addNewUser(req, res);

      res.redirect.calledWith('/auth/signUp/?error=userexists').should.equal(true);
      done();
    }).timeout(5000);
    it('should allow a user to be created if user not already exists', (done) => {
      const req = {
        body: {
          username: testusername,
        },
      };
      const res = {
        redirect: sinon.spy(),
      };

      findOneMock.yields('');
      saveMock.yields('error', {});
      addNewUser(req, res);

      res.redirect.calledWith('/auth/signUp/?error=dberror').should.equal(true);
      done();
    }).timeout(5000);
  });
  describe('signInPage', () => {
    it('should render index page', (done) => {
      const req = {
        query: {
          error: '',
        },
      };
      const res = {
        render: sinon.spy(),
      };
      signInPage(req, res);
      res.render.calledOnceWith('index').should.equal(true);
      done();
    });
  });
  describe('signUpPage', () => {
    it('should render index page', (done) => {
      const req = {
        query: {
          error: '',
        },
      };
      const res = {
        render: sinon.spy(),
      };
      signUpPage(req, res);
      res.render.calledOnceWith('signUp').should.equal(true);
      done();
    });
  });
});
