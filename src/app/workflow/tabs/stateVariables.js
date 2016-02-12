import angular from 'angular';


var m = angular.module('nflowExplorer.workflow.tabs.stateVariables', []);

  m.directive('workflowTabStateVariables', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        workflow: '='
      },
      bindToController: true,
      controller: 'WorkflowTabStateVariablesCtrl',
      controllerAs: 'ctrl',
      template: require('./stateVariables.html')
    };
  });

  m.controller('WorkflowTabStateVariablesCtrl', function() {});

export default m.name;
