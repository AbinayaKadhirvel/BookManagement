const debug = require('debug')('app:authController');
const errorCode = require('../config/errorcodes');
const HttpStatus = require('http-status-codes');
const User = require('../../models/libraryUserModel.js');

function authController() {
  function signUpPage(req, res) {
    res.render(
      'signUp',
      {
        title: 'Sign Up',
        error: req.query.error,
        errorCode,
      }
    );
  }

  function addNewUser(req, res) {
    query = { username: req.body.username };
    User.findOne(query, (err, userfound) => {
      if (userfound) {
        res.redirect('/auth/signUp/?error=userexists');
      }
      else {
        const usertocreate = new User(req.body);
        usertocreate.save((err, useradded) => {
          if (err) {
            res.redirect('/auth/signUp/?error=dberror');
          }
          else {
            req.login(useradded, () => {
              res.redirect('/books');
            });
          }
        });
      }
    });
  }

  function signInPage(req, res) {
    res.render('index', {
      title: 'Sign In',
      error: req.query.error,
      errorCode,
    });
  }

  function authenticateUser(req, res) {
    console.log('here');
    query = { username: req.body.username };
    User.findOne(query, (err, user) => {
      if (user && user.password === req.body.password) {
        req.login(user, () => {
          res.redirect('/books');
        });
        // passport.authenticate('local', {
        //   successRedirect: '/books',
        //   failureRedirect: '/?error=userdoesnotexists',
        // });
      }
      else {
        res.redirect('/?error=userdoesnotexists');
      }
    });
  }
  function addbooktouser (req, res) {
    if (!req.query.bookid) {
      res.status(HttpStatus.BAD_REQUEST);
      res.send(errorCode.NoBookRequested);
    }
    else if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user._id) {
      userid = req.session.passport.user._id;
      User.findById(userid, (err, user) => {
        if (err) {
          debug(err);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR);
          res.send(errorCode.DBError);
        }
        else {
          if (user.books.indexOf(req.query.bookid) < 0) {
            user.books.push(req.query.bookid);
            user.save((err) => {
              if (err) {
                debug(err);
                res.status(HttpStatus.INTERNAL_SERVER_ERROR);
                res.send(errorCode.DBError);
              }
              else {
                res.status(HttpStatus.OK);
                res.send();
              }
            });
          }
          else {
            res.status(HttpStatus.BAD_REQUEST).send(errorCode.BookAlreadyAdded);
          }

        }
      });
    }
    else {
      res.status(HttpStatus.BAD_REQUEST);
      res.send(errorCode.userSessionTimedout);
    }
  }
  // Revealing Module Pattern
  return {
    signUpPage,
    addNewUser,
    signInPage,
    authenticateUser,
    addbooktouser,
  };
}

module.exports = authController;
