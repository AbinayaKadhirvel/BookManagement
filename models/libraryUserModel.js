const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const libraryUserModel = new Schema({
  username: { type: String, unique: true },
  password: { type: String },
  books: [ {
    type: Schema.Types.ObjectId,
    ref: 'Book',
  } ],
});

module.exports = mongoose.model('libraryUser', libraryUserModel);
