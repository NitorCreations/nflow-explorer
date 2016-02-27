import angular from 'angular';

export default angular.module('nflowExplorer.about', [])
.controller('AboutCtrl', function AboutCtrl($scope, config) {
  $scope.nflowUrl = function() {
    return config.nflowUrl;
  };

  $scope.nflowApiDocs = function() {
    return config.nflowApiDocs;
  };
}).name;
