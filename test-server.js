// You can use this server to run app from dist/ directory

// Use javascript 5 syntax here

var http = require('http')
var express = require('express')
var proxy = require('express-http-proxy')

/*
 * // create and start server
 * var server = startServer(8001, 'dist')
 *
 * // closing server
 * server.close()
 */
function startServer(port, distDir, callback) {
  var app = express()

  // enable logging
  app.use(require('morgan')('short'));

  // serve static files from dist/ directory
  app.use(express.static(distDir))

  app.use('/api', proxy('testapi.katsomo.fi:80', {
    forwardPath: function(req, res) {
      return '/api/' + require('url').parse(req.url).path;
    },
  }))

  // respond to everything with the index.html contents
  // to make domain.fi/settings style URLs work without hashes
  /*
   app.get('/', function root(req, res) {
     res.sendFile(__dirname + '/dist/index.html');
   });
   */

  var server = http.createServer(app);
  server.listen(port, function onListen() {
    var address = server.address();
    console.log('Listening on: %j', address);
    console.log(' -> that probably means: http://localhost:%d', address.port);
    if(callback) {
      callback()
    }
  });

  return server
}

if (require.main === module) {
  var server = startServer(process.env.PORT || 8001, 'dist')
}

module.exports = startServer
