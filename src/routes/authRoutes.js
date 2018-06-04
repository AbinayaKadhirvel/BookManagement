const express = require('express');
//const mongoose = require('mongoose');
const debug = require('debug')('app:authRoutes');


//const db = mongoose.connect('mongodb://localhost/libraryApp');
const authController = require('../controllers/authController');

const { signUpPage, addNewUser, signInPage, authenticateUser } = authController();
const authRouter = express.Router();
function router() {
  authRouter.route('/signUp')
    .get(signUpPage)
    .post(addNewUser);
  authRouter.route('/signIn')
    .get(signInPage)
    .post(authenticateUser);

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
