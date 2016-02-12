import angular from 'angular';

var m = angular.module('nflowExplorer.executors', []);

  m.controller('ExecutorsCtrl', function ExecutorsCtrl(ExecutorPoller) {
    var self = this;
    self.executors = ExecutorPoller.executors;
  });

export default m.name;
