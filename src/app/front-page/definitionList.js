import angular from 'angular';


var m = angular.module('nflowExplorer.frontPage.definitionList', []);

  m.directive('definitionList', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        definitions: '='
      },
      bindToController: true,
      controller: 'DefinitionListCtrl as ctrl',
      template: require('./definitionList.html')
    };
  });

  m.controller('DefinitionListCtrl', function() {});

export default m.name;
