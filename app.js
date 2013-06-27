/**
 * Module dependencies.
 */

var express = require('express'),
  routes = require('./routes'),
  imageUploader = require('./routes/imageUploader'),
  http = require('http'),
  kue = require('kue'),
  path = require('path');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({
  src: __dirname + '/public'
}));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Image Processing
app.use('/image-processing/', kue.app);


// Base index route
app.get('/', routes.index);

// Upload image post route
app.post('/upload', imageUploader.uploadImages);


http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});