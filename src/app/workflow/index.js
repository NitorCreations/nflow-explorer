import angular from 'angular';

export default angular.module('nflowExplorer.workflow', [
  require('./workflow.js'),
  require('./workflowGraph.js'),
  require('./workflowInfo.js'),
  require('./workflowTabs.js'),
  require('./tabs/actionHistory.js'),
  require('./tabs/manage.js'),
  require('./tabs/stateVariables.js'),
]).name;
