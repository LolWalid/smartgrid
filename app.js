var express = require('express')
var session = require('express-session')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var http = require('http')

// DataBase
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost/sg", {native_parser: true})
var seed = require('./app/seed.js')

var routes = require('./routes/index')
var players = require('./routes/players')
var objectives = require('./routes/objectives')
var events = require('./routes/events')
var actions = require('./routes/actions')
var resources = require('./routes/resources')
var decisions = require('./routes/decisions')
var objects = require('./routes/objects')
var profiles = require('./routes/profiles')
var cities = require('./routes/cities')
var logs = require('./routes/logs')

var app = express();

app.server = http.createServer(app);
var io = require('socket.io').listen(app.server);

seed.seed(db);
require('./app/sockets.js').sockets(io, db);



app.server.listen(3000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(session({secret: 'chut', saveUninitialized: true, resave: true}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
  req.db = db;
  next();
});

app.use('/', routes);
app.use('/players', players);
app.use('/objectives', objectives);
app.use('/events', events);
app.use('/actions', actions);
app.use('/resources', resources);
app.use('/objects', objects);
app.use('/decisions', decisions);
app.use('/profiles', profiles);
app.use('/cities', cities);
app.use('/logs', logs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.locals.pretty = true;
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to objectif
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) seed.clean(db);
    if (err) console.log(err.stack);
    if (options.exit) process.exit();
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

module.exports = app;
