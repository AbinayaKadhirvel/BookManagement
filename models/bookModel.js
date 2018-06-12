const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookmodel = new Schema({
  author: { type: String },
  title: { type: String },
  read: { type: Boolean, "default": false },
  genre: { type: String },
});

module.exports = mongoose.model('Book', bookmodel);
