import angular from 'angular';

var m = angular.module('nflowExplorer.workflow.tabs', []);

  m.directive('workflowTabs', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        definition: '=',
        workflow: '=',
        childWorkflows: '='
      },
      bindToController: true,
      controller: 'WorkflowTabsCtrl',
      controllerAs: 'ctrl',
      template: require('./workflowTabs.html')
    };
  });

  m.controller('WorkflowTabsCtrl', function() {});

export default m.name;
