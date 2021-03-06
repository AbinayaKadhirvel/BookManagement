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
const readYaml = require('read-yaml');
const errorCode = require('./src/config/errorcodes');
// To create an instance of express
const app = express();
const port = process.env.PORT || 3000;

const swaggerUi = require('swagger-ui-express');
const swaggerConfig = readYaml.sync(path.resolve(__dirname, './api/swagger/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));
if (process.env.ENV !== 'Test') {
  app.use(morgan('combined'));
}
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
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/css', express.static(path.join(__dirname, '/public/css')));
app.use('/fonts', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/fonts')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.set('views', './src/views');
app.set('view engine', 'ejs');



const bookRouter = require('./src/routes/bookRoutes')();
const authRouter = require('./src/routes/authRoutes')();
const bookAPIRouter = require('./src/routes/bookAPIRoutes')();
app.use('/books', function (req, res, next) {
  if (process.env.ENV === 'Test') {
    next();
  }
  else {
    if (req.session && req.session.passport && req.session.passport.user && req.session.passport.user._id) {
      req.sessionuserid = req.session.passport.user._id;
      next();
    }
    else {
      res.redirect('/');
    }
  }

});
app.use(methodOverride(function (req) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use('/books', bookRouter);
app.use('/auth', authRouter);
app.use('/bookAPI', bookAPIRouter);

app.get('/', (req, res) => {
  res.render(
    'index',
    {
      title: 'Sign In',
      error: req.query.error,
      errorCode,
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
