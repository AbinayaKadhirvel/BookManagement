const express = require('express');

const bookRouter = express.Router();
const debug = require('debug')('app:bookRoutes');
const bookController = require('../controllers/bookController');

function router() {
  const { getAll, getById, middleware, postNew, addNewBook, updateOneBook, deleteBook } = bookController();
  debug('BookRouter');
  bookRouter.route('/')
    .get(getAll)
    .post(postNew);

  bookRouter.use('/:bookId', middleware);
  bookRouter.route('/:bookId')
    .get(getById)
    .put(addNewBook)
    .patch(updateOneBook)
    .delete(deleteBook);
  return bookRouter;
}
module.exports = router;
