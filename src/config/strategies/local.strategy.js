const passport = require('passport');
const debug = require('debug')('app:local.strategy');
const { Strategy } = require('passport-local');
const mongoose = require('mongoose');
let options = {
  keepAlive: 1, connectTimeoutMS: 30000, reconnectTries: 30, reconnectInterval: 5000,
};
if (process.env.ENV === 'Test') {
  const db = mongoose.connect('mongodb://localhost/libraryAppTest', options);
}
else {
  const db = mongoose.connect('mongodb://localhost/libraryApp', options);
}

const User = require('../../../models/libraryUserModel.js');

module.exports = function localStrategy() {
  passport.use(new Strategy({
    usernameField: 'username',
    passwordField: 'password',
  }, (username, password, done) => {
    const query = {};
    query.username = username;
    debug(username);
    User.findOne(query, (err, user) => {
      debug(user);
      if (user && user.password === password) {
        done(null, user);
      }
      else {
        done(null, false);
      }
    });
  }));
};
