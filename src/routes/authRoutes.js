const express = require('express');
//const mongoose = require('mongoose');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');


//const db = mongoose.connect('mongodb://localhost/libraryApp');
const User = require('../../models/libraryUserModel.js');

const authRouter = express.Router();
const nav = [
  { link: '/books', title: 'Book' },
];
function router() {
  authRouter.route('/signUp')
    .get((req, res) => {
      res.render(
        'index',
        {
          nav: [ { link: '/books', title: 'Books' } ],
          title: 'Library',
        }
      );
    })
    .post((req, res) => {
      const usertocreate = new User(req.body);
      usertocreate.save((err, useradded) => {
        if (err) {
          res.status(500).send(err);
        }
        else {
          req.login(useradded, () => {
            res.redirect('/auth/signin');
          });
        }
      });
    });
  authRouter.route('/signIn')
    .get((req, res) => {
      res.render('signin', {
        nav,
        title: 'Sign In',
      });
    })
    .post(
      passport.authenticate('local', {
        successRedirect: '/books',
        failureRedirect: '/',
      }));

  authRouter.route('/profile')
    .all((req, res, next) => {
      if (req.user) {
        next();
      }
      else {
        res.redirect('/');
      }
    })
    .get((req, res) => {
      debug(req.body);
      res.json(req.user);
    });
  return authRouter;
}

module.exports = router;
