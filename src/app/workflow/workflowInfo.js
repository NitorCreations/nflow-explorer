import angular from 'angular';


var m = angular.module('nflowExplorer.workflow.info', []);

  m.directive('workflowInfo', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        workflow: '=',
        parentWorkflow: '=',
        childWorkflows: '=',
      },
      bindToController: true,
      controller: 'WorkflowInfoCtrl',
      controllerAs: 'ctrl',
      template: require('./workflowInfo.html')
    };
  });

  m.controller('WorkflowInfoCtrl', function(WorkflowGraphApi) {
    var self = this;
    self.currentStateTime = currentStateTime;
    self.selectAction = WorkflowGraphApi.onSelectNode;

    function currentStateTime() {
      return _.result(self, 'modified', '');
    }
  });

export default m.name;
