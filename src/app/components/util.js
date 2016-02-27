import angular from 'angular';


var m = angular.module('nflowExplorer.util', []);

  m.directive('emptyToNull', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elem, attrs, ctrl) {
        ctrl.$parsers.push(function(viewValue) {
          if(viewValue === '') {
            return null;
          }
          return viewValue;
        });
      }
    };
  });

export default m.name;
