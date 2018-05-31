const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const libraryUserModel = new Schema({
  username: { type: String, unique: true },
  password: { type: String }
});

module.exports = mongoose.model('libraryUser', libraryUserModel);
