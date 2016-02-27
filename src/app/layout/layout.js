import angular from 'angular';


var m = angular.module('nflowExplorer.layout', []);

  m.directive('layout', function() {
    return {
      restrict: 'E',
      replace: 'true',
      template: require('./layout.html')
    };
  });

  m.directive('pageHeader', function() {
    return {
      restrict: 'E',
      replace: 'true',
      template: require('./header.html'),
      controller: 'PageHeaderCtrl as ctrl'
    };
  });

  m.directive('pageFooter', function() {
    return {
      restrict: 'E',
      replace: 'true',
      template: require('./footer.html')
    };
  });

  m.controller('PageHeaderCtrl', function($location, $state) {
    var self = this;
    // nope, $stateParams.radiator wont work here
    self.radiator = !!$location.search().radiator;
    self.isFrontPageTabActive = function() { return $state.includes('frontPageTab'); };
    self.isExecutorsTabActive = function() { return $state.includes('executorsTab'); };
    self.isSearchTabActive = function() { return $state.includes('searchTab'); };
    self.isAboutTabActive = function() { return $state.includes('aboutTab'); };
    self.logoUrl = require('../../images/nflow_logo.svg');
  });

export default m.name;
