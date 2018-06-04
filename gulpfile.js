let gulp = require('gulp');
const jshint = require('gulp-jshint');
const nodemon = require('gulp-nodemon');
const jscs = require('gulp-jscs');
const gulpMocha = require('gulp-mocha');
const env = require('gulp-env');
const supertest = require('supertest');

const jsFiles = [ '*.js', 'src/**/*.js' ];

gulp.task('style', () => gulp.src(jsFiles)
  .pipe(jshint())
  .pipe(reporter('jshint-stylish', {
    verbose: true,
  }))
  .pipe(jscs()));

gulp.task('default', () => {
  nodemon({
    script: 'app.js',
    ext: 'js',
    env: {
      PORT: 4000,
      DEBUG: 'app,app:*',
    },
    ignore: [ './node_modules/**' ],
  })
    .on('restart', () => {
      console.log('Restarting');
    });
});

gulp.task('test', () => {
  env({ vars: { ENV: 'Test' } });
  gulp.src('./src/tests/*.js', { read: false })
    .pipe(gulpMocha({ reporter: 'nyan' }));
});


gulp.task('inject', () => {
  const wiredep = require('wiredep').stream;

  const options = {
    bowerJson: require('./bower.json'),
    directory: './public/lib',
  };

  return gulp.src('./src/views/*.html')
    .pipe(wiredep(options))
    .pipe(gulp.dest('./src/views'));
});
