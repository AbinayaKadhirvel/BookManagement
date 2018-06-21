const express = require('express');
//const mongoose = require('mongoose');
const debug = require('debug')('app:authRoutes');


//const db = mongoose.connect('mongodb://localhost/libraryApp');
const authController = require('../controllers/authController');

const { signUpPage, addNewUser, signInPage, authenticateUser, addbooktouser } = authController();
const authRouter = express.Router();
function router() {
  authRouter.route('/signUp')
    .get(signUpPage)
    .post(addNewUser);
  authRouter.route('/signIn')
    .get(signInPage)
    .post(authenticateUser);
  authRouter.route('/logout')
    .get(function(req, res) {
      req.session.destroy(function () {
        res.redirect('/'); //Inside a callback… bulletproof!
      });
    });
  authRouter.route('/addbook')
    .post(addbooktouser);
  return authRouter;
}

module.exports = router;
