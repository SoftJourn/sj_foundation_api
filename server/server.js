'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')

var app = module.exports = loopback();

boot(app, __dirname);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());
// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
  extended: true,
}));

app.use(loopback.token({
  model: app.models.accountAccessToken,
  currentUserLiteral: 'me'
}));

app.use(cookieParser());

//START SERVER
app.start = function() {

  // mysql autoupdate if needed
  var models = ['account','transaction', 'project', 'income', 'update', 'accountAccessToken', 'file'];
  app.datasources['mysql'].isActual(models, function(err, actual) {
    if (!actual) {
      app.datasources['mysql'].autoupdate(models, function(err, result) {
        console.log('database updated');
      });
    }
  });

  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
