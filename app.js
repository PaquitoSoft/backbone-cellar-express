
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    util = require('util');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3003);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

// Allow CORS requests
app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', "*");
  res.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.set("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/api/wines', routes.getAll);
app.get('/api/wines/search/:query', routes.searchWine);
app.get('/api/wines/:id', routes.getWine);
app.post('/api/wines', routes.createWine);
app.put('/api/wines/:id', routes.updateWine);
app.delete('/wines/:id', routes.removeWine);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
