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
  return authRouter;
}

module.exports = router;
