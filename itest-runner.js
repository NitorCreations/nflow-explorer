var Server = require('./test-server')

var server = Server(9001, 'dist', function() {
  require('protractor/lib/cli')
})


