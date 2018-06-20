//const mongoose = require('mongoose');
const debug = require('debug')('app:authController');
const errorCode = require('../config/errorcodes');

//const db = mongoose.connect('mongodb://localhost/libraryApp');
const User = require('../../models/libraryUserModel.js');
const nav = [
  { link: '/books', title: 'Book' },
];
function authController() {
  function signUpPage(req, res) {
    res.render(
      'signUp',
      {
        nav: nav,
        title: 'Library',
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
      nav,
      title: 'Sign In',
      error: req.query.error,
      errorCode,
    });
  }

  function authenticateUser(req, res) {
    debug('here');
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
  // Revealing Module Pattern
  return {
    signUpPage,
    addNewUser,
    signInPage,
    authenticateUser,
  };
}

module.exports = authController;
