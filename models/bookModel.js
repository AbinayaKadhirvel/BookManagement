const mongoose = require('mongoose');
//mongoose.plugin(require('mongoose-faker'));
let faker = require('faker');
const Schema = mongoose.Schema;

const bookmodel = new Schema({
  author: { type: String },
  title: { type: String },
  read: { type: Boolean, 'default': false },
  genre: { type: String },
  imageURL: {
    type: String,
    'default': function() {
      return faker.image.avatar();
    },
  },
  description: { type: String },
});

module.exports = mongoose.model('Book', bookmodel);
