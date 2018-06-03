const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
//const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override');
// To create an instance of express
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'library',
  saveUninitialized: true,
  resave: true,
}));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, '/public/')));
app.use((req, res, next) => {
  //TODO
  next();
});
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/css', express.static(path.join(__dirname, '/public/css')));
app.use('/fonts', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/fonts')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.set('views', './src/views');
app.set('view engine', 'ejs');



const bookRouter = require('./src/routes/bookRoutes')();
const adminRouter = require('./src/routes/adminRoutes')();
const authRouter = require('./src/routes/authRoutes')();
app.use(methodOverride(function (req) {
  debug(req.body);
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
  res.render(
    'index',
    {
      nav: [ { link: '/books', title: 'Books' } ],
      title: 'Library',
      error: req.query.error,
    }
  );
});

module.exports = app.listen(port, (err) => {
  if (err) {
    debug(`Server error:  ${chalk.red(err)}`);
  }
  else {
    debug(`Running server on port: ${chalk.green(port)}`);
  }
});
