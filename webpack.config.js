module.exports = require('./webpack/webpack.make')({
  BUILD: false,
  TEST: false,
  ROOT_DIR: __dirname,
  ENV: 'dev'
});