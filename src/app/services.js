import angular from 'angular';
export default angular.module('nflowExplorer.services', [])
.constant('config', {}) // TODO new config
.factory('Workflows', function WorkflowsFactory($resource, config) {
  return $resource(config.nflowUrl + '/v1/workflow-instance/:id',
                   {id: '@id', include: 'actions,currentStateVariables,actionStateVariables'},
                   {'update': {method: 'PUT'},
                   });
})
.factory('WorkflowSearch', function WorkflowSearchFactory($resource, config) {
  return $resource(config.nflowUrl + '/v1/workflow-instance');
})
.factory('Executors', function ExecutorsFactory($resource, config) {
  return $resource(config.nflowUrl + '/v1/workflow-executor');
})
.factory('WorkflowDefinitions', function WorkflowDefinitionsFactory($resource, config, $cacheFactory) {
  return $resource(config.nflowUrl + '/v1/workflow-definition',
                   {type: '@type'},
                   {'get': {isArray: true,
                            method:  'GET',
                            cache: $cacheFactory('workflow-definition')},
                    'query': {isArray: true,
                              method: 'GET',
                              cache: $cacheFactory('workflow-definition-list')}
                   });
})
.factory('WorkflowDefinitionStats', function WorkflowDefinitionStatsFactory($resource, config) {
  return $resource(config.nflowUrl + '/v1/statistics/workflow/:type',{type: '@type'});
})
.service('GraphService', function GraphServiceFactory($q, $http, $rootScope) {
  this.loadCss = function getCss() {
    var defer = $q.defer();
    // links are relative to displayed page
    $http.get('styles/data/graph.css')
    .success(function(data) {
      $rootScope.graph = {};
      $rootScope.graph.css=data;
      defer.resolve();
    })
    .error(function() {
      console.warn('Failed to load graph.css');
      $rootScope.graph = {};
      defer.resolve();
    });
    return defer.promise;
  };
})
.service('WorkflowStatsPoller', function WorkflowStatsPoller($rootScope, config, $interval,
                                                              WorkflowDefinitions, WorkflowDefinitionStats) {
  var tasks = {};

  function addStateData(type, time, stats) {
    var data = tasks[type].data;
    data.push([time, stats]);
    while(data.length > config.maxHistorySize) {
      data.shift();
    }
  }

  function updateStats(type) {
    WorkflowDefinitionStats.get({type: type},
                                function(stats) {
                                  console.info('Fetched statistics for ' + type);
                                  addStateData(type, new Date(), stats);
                                  tasks[type].latest = stats;
                                  $rootScope.$broadcast('workflowStatsUpdated', type);
                                },
                                function() {
                                  console.error('Fetching workflow ' + type + ' stats failed');
                                  addStateData(type, new Date(), {});
                                  $rootScope.$broadcast('workflowStatsUpdated', type);
                                });
  }

  this.start = function(type) {
    if(!tasks[type]) {
      tasks[type] = {};
      tasks[type].data = [];
      console.info('Start stats poller for ' + type + ' with period ' + config.radiator.pollPeriod + ' seconds');
      updateStats(type);
      tasks[type].poller = $interval(function() { updateStats(type); },
                                     config.radiator.pollPeriod * 1000);
      return true;
    }
    return false;
  };

  this.getLatest = function(type) {
    if(!tasks[type]) {
      return undefined;
    }
    return tasks[type].latest;
  };
})
.service('Time', function Time() {
  var self = this;
  self.currentMoment = function() {
    return moment();
  };
}).name;
