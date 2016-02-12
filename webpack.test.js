/**
 * Webpack config for tests
 */
module.exports = require('./webpack/webpack.make')({
  BUILD: false,
  TEST: true,
  ENV: 'dev'
});