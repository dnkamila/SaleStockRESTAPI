var express = require('express');
var expressValidator = require('express-validator');
//var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');

module.exports = function (CartRouter, OrderRouter) {
  var app = express();

  /*app.set('views', path.join(__dirname, 'views'));
   app.set('view engine', 'ejs');*/

  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(expressValidator({

  }));

  app.use('/cart/', CartRouter);
  app.use('/order/', OrderRouter);

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  /*if (app.get('env') === 'development') {
   app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
   message: err.message,
   error: err
   });
   });
   }*/

  // production error handler
  // no stacktraces leaked to user
  /*app.use(function(err, req, res, next) {
   res.status(err.status || 500);
   res.render('error', {
   message: err.message,
   error: {}
   });
   });*/

  return app;
};
