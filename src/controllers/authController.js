//const mongoose = require('mongoose');
const HttpStatus = require('http-status-codes');
const debug = require('debug')('app:authController');
const passport = require('passport');

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
      }
    );
  }

  function addNewUser(req, res) {
    query = { username: req.body.username };
    User.findOne(query, (err, user) => {
      debug(user);
      if (user) {
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
              res.redirect('/');
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
    });
  }

  function authenticateUser() {
    passport.authenticate('local', {
      successRedirect: '/books',
      failureRedirect: '/?error=userdoesnotexists',
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
