import angular from 'angular';

var m = angular.module('nflowExplorer.search', [
  require('./criteriaModel'),
  require('./search'),
  require('./searchForm'),
  require('./searchResult'),
]);

export default m.name;
