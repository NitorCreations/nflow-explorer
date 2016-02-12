import angular from 'angular';

require('styles/main.scss');
require('styles/dagre.css');
require('../images/nflow_logo.svg');

//require('../external/angular-ui-bootstrap/ui-bootstrap-custom-0.10.0.js');
//require('../external/dagre-d3/js/dagre-d3.js');

var m = angular.module('nflowExplorer', [
  require('./services'),
  require('./services/executorPoller'),

  require('./about/about'),
  require('./executors/executors'),
  require('./executors/executorTable'),
  require('./front-page/frontPage'),
  require('./front-page/definitionList'),

  require('./components'),
  require('./layout/layout'),
  require('./search'),
  require('./workflow-stats/workflowStats'),
  require('./workflow'),
  require('./workflow-definition'),
  require('./config'),

  require('angular-animate'),
  require('angular-cookies'),
  require('angular-sanitize'),
  require('angular-touch'),
]);

/*
m.run(function (ExecutorPoller) {
  ExecutorPoller.start();
});
*/
export default m.name;
