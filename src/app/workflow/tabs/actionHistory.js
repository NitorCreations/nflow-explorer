import angular from 'angular';
import moment from 'moment';

var m = angular.module('nflowExplorer.workflow.tabs.actionHistory', []);

  m.directive('workflowTabActionHistory', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        workflow: '=',
        childWorkflows: '='
      },
      bindToController: true,
      controller: 'WorkflowTabActionHistoryCtrl',
      controllerAs: 'ctrl',
      template: require('./actionHistory.html')
    };
  });

  m.controller('WorkflowTabActionHistoryCtrl', function(WorkflowGraphApi) {
    var self = this;

    self.selectAction = WorkflowGraphApi.onSelectNode;
    self.duration = duration;
    self.childWorkflowFromAction = childWorkflowFromAction;

    function duration(action) {
      var start = moment(action.executionStartTime);
      var end = moment(action.executionEndTime);
      if(!start || !end) {
        return '-';
      }
      var d = moment.duration(end.diff(start));
      if(d < 1000) {
        return d + ' msec';
      }
      return d.humanize();
    }

    function childWorkflowFromAction(action) {
      return _.filter(self.childWorkflows, {parentActionId: action.id});
    }

  });

export default m.name;
