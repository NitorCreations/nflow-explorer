import angular from 'angular';

var m = angular.module('nflowExplorer.services.executorPoller', [
    'nflowExplorer.services'
  ]);

  m.factory('ExecutorPoller', function ($interval, config, Executors) {
    var started = false;

    var api = {};
    api.executors = [];
    api.start = start;
    return api;

    function start() {
      if (!started) {
        started = true;
        console.info('Start executor poller with period ', config.radiator.pollPeriod, ' seconds');
        updateExecutors();
        $interval(updateExecutors, config.radiator.pollPeriod * 1000);
      }
      console.info('Executor poller already started');
    }

    function updateExecutors() {
      console.info('Fetching executors');
      Executors.query(function (executors) {
        angular.copy(executors, api.executors);
      });
    }
  });

export default m.name;
