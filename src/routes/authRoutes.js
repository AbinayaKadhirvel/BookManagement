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
        'signUp',
        {
          nav: [ { link: '/books', title: 'Books' } ],
          title: 'Library',
          error: req.query.error,
        }
      );
    })
    .post((req, res) => {
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
    });
  authRouter.route('/signIn')
    .get((req, res) => {
      res.render('index', {
        nav,
        title: 'Sign In',
        error: req.query.error,
      });
    })
    .post(
      passport.authenticate('local', {
        successRedirect: '/books',
        failureRedirect: '/?error=userdoesnotexists',
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
