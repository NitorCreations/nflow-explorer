import angular from 'angular';

var m = angular.module('nflowExplorer.workflow.workflow', []);

  m.controller('WorkflowCtrl', function (workflow, definition,
                                          parentWorkflow, childWorkflows) {
    var self = this;
    self.workflow = workflow;
    self.parentWorkflow = parentWorkflow;
    self.definition = definition;
    self.childWorkflows = childWorkflows;
  });

export default m.name;
