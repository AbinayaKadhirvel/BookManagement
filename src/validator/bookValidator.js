const validator = require('validator');
const errorCode = require('../config/errorcodes');

module.exports = {
  validateBookId: (BookID, callback) => {
    callback = callback || (() => {});
    if (validator.isMongoId(BookID)) {
      return callback({
        bookID: BookID,
        err: '',
      });
    }
    else {
      return callback({
        err: errorCode.NotValidID,
      });
    }
  },
};
