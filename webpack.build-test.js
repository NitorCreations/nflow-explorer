/**
 * Webpack config for builds
 */
module.exports = require('./webpack/webpack.make')({
  BUILD: true,
  TEST: false,
  ROOT_DIR: __dirname,
  ENV: 'test',
});
