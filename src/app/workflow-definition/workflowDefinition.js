import angular from 'angular';

var m = angular.module('nflowExplorer.workflowDefinition.workflowDefinition', []);

  m.controller('WorkflowDefinitionCtrl', function (definition) {
    var self = this;
    self.definition = definition;
  });

export default m.name;
