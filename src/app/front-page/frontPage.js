import angular from 'angular';

var m = angular.module('nflowExplorer.frontPage', []);

  m.controller('FrontPageCtrl', function FrontPageCtrl(WorkflowDefinitions) {
    var self = this;
    self.definitions = WorkflowDefinitions.query();
  });

export default m.name;
