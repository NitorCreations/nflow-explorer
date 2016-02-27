import angular from 'angular';

export default angular.module('nflowExplorer.components', [
  require('./constants'),
  require('./filters'),
  require('./graph'),
  require('./util')
]).name
