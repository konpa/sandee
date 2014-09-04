/*
|--------------------------------------------------------------------------
| sandee Node App
|--------------------------------------------------------------------------
|
| Initialize and configure sandee app with node express
|
*/


/**
* Modules
*/
var express = require('express'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    morgan = require('morgan'),
    routes = require('./routes'),
    partials = require('./routes/partials'),
    api = require('./routes/api'),
    http = require('http'),
    path = require('path'),
    browserSync = require('browser-sync'),
    spawn = require('child_process').spawn,
    session = require('express-session');

var app = module.exports = express();


/**
* Configuration
*/

// Detect OS
var os = process.platform;
var isWindows = (process.platform == "win32" || process.platform == "win64") ? true : false;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(session({secret: 'sandee'}));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (process.argv[2]) {
    app.use(errorHandler());

    // Launch gulp for dev
    var cmd = isWindows ? 'gulp.cmd' : 'gulp';
    var gulp = spawn(cmd, ['--gulpfile', './gulpfile.js']);

    // Print gulp messages
    gulp.stdout.pipe(process.stdout);
    gulp.stderr.pipe(process.stderr);
} else {
  // production only
}


/**
* Routes
*/

// serve index
app.use('/', routes);

// server view partials
app.use('/partials', partials);

// JSON API
app.use('/api', api);

// redirect all others to the index (HTML5 history)
app.get('*', function(req, res, next) {
    res.render('global');
});


/**
* Start Server
*/

http.createServer(app).listen(app.get('port'), function () {
    console.log('\n ******************* \n Sandee is now runnning on http://localhost:' + app.get('port') + '\n *******************');
});
