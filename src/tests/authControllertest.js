const should = require('should');
const sinon = require('sinon');
const mongoose = require('mongoose');
const HttpStatus = require('http-status-codes');
const errorCode = require('../config/errorcodes');
const User = require('../../models/libraryUserModel.js');
const authController = require('../controllers/authController');

let testusername = 'TestUser';
let findOneMock;
let saveMock;
const { signUpPage, addNewUser, signInPage, authenticateUser, addbooktouser } = authController();
describe('Auth Controller Tests', () => {
  describe('authenticateUser', () => {
    beforeEach(() => {
      findOneMock = sinon.stub(User, 'findOne');
      saveMock = sinon.stub(User.prototype, 'save');
    });
    afterEach(() => {
      findOneMock.restore();
      saveMock.restore();
    });
    it('should not allow a user to be logged in if user credentials are wrong', (done) => {
      const req = {
        body: {
          username: testusername,
          password: 'password1',
        },
      };
      const res = {
        redirect: sinon.spy(),
      };

      findOneMock.yields('', { username: testusername, password: 'wrongpassword' });
      authenticateUser(req, res);

      res.redirect.calledWith('/?error=userdoesnotexists').should.equal(true);
      done();
    }).timeout(5000);
    it('should allow a user to be logged in if user creds are correct', (done) => {
      const req = {
        body: {
          username: testusername,
          password: 'password1',
        },
        login: sinon.spy(),
      };
      const res = {
        redirect: sinon.spy(),
      };

      findOneMock.yields('', { username: testusername, password: 'password1' });
      authenticateUser(req, res);
      //console.log(req.login);
      req.login.calledWith({
        username: testusername,
        password: 'password1',
      }).should.equal(true);
      done();
    }).timeout(5000);
  });
  describe('addNewUser', () => {
    beforeEach(() => {
      findOneMock = sinon.stub(User, 'findOne');
      saveMock = sinon.stub(User.prototype, 'save');
    });
    afterEach(() => {
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
  describe('addbooktouser', () => {
    beforeEach(() => {
      findByIDMock = sinon.stub(User, 'findById');
      saveMock = sinon.stub(User.prototype, 'save');
    });
    afterEach(() => {
      findByIDMock.restore();
      saveMock.restore();
    });
    it('Should render bad request if bookid is not passed', (done) => {
      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
      };
      const req = {
        query: {
          error: '',
        },
      };
      addbooktouser(req, res);
      res.status.calledWith(HttpStatus.BAD_REQUEST);
      res.send.calledWith(errorCode.NoBookRequested);
      done();
    });
    it('Should render bad request if usersession is not active', (done) => {
      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
      };
      const req = {
        query: {
          bookid: '213',
        },
      };
      addbooktouser(req, res);
      res.status.calledWith(HttpStatus.BAD_REQUEST);
      res.send.calledWith(errorCode.userSessionTimedout);
      done();
    });
    it('Should render throw DB error', (done) => {

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
      };
      const req = {
        query: {
          bookid: '213',
        },
        session: {
          passport: {
            user: {
              _id: '1234',
            },
          },
        },
      };
      findByIDMock.yields('error');
      addbooktouser(req, res);
      res.status.calledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send.calledWith(errorCode.DBError);
      done();
    });
    it('Should render throw DB error', (done) => {

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
      };
      const req = {
        query: {
          bookid: mongoose.Types.ObjectId(),
        },
        session: {
          passport: {
            user: {
              _id: '1234',
            },
          },
        },
      };
      const user = new User({
        _id: mongoose.Types.ObjectId(),
        books: [],
      });
      findByIDMock.yields('', user);
      saveMock.yields('error');
      addbooktouser(req, res);
      res.status.calledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      res.send.calledWith(errorCode.DBError);
      done();
    });
    it('Should add Book to user', (done) => {

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
      };
      const req = {
        query: {
          bookid: mongoose.Types.ObjectId(),
        },
        session: {
          passport: {
            user: {
              _id: '1234',
            },
          },
        },
      };
      const user = new User({
        _id: mongoose.Types.ObjectId(),
        books: [],
      });
      findByIDMock.yields('', user);
      saveMock.yields('');
      addbooktouser(req, res);
      res.status.calledWith(HttpStatus.OK);
      done();
    });
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
    it('should render singUp page', (done) => {
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
