import angular from 'angular';

var m = angular.module('nflowExplorer.workflow.graph', []);

  m.directive('workflowGraph', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        definition: '=',
        workflow: '='
      },
      bindToController: true,
      controller: 'WorkflowGraphCtrl',
      controllerAs: 'ctrl',
      template: '<div class="svg-container"><svg id="workflowSvg"/></div>'
    };
  });

  m.controller('WorkflowGraphCtrl', function ($rootScope, WorkflowGraphApi, Graph) {
    var self = this;

    initialize();

    function initialize() {
      var graph = initGraph(self.definition, self.workflow);
      WorkflowGraphApi.registerOnSelectNodeListener(graph.nodeSelected);
      graph.drawWorkflowDefinition();
    }

    function initGraph(definition, workflow) {
      var d = definition;
      var w = workflow;
      var g = Graph.workflowDefinitionGraph(d, w);
      var selectedNode;

      var self = {};

      self.drawWorkflowDefinition = function() {
        Graph.drawWorkflowDefinition(g, '#workflowSvg', WorkflowGraphApi.onSelectNode, $rootScope.graph.css);
        Graph.markCurrentState(w);
      };

      self.nodeSelected = function(nodeId) {
        console.debug('Selecting node ' + nodeId);
        if (selectedNode) { Graph.setNodeSelected(g, selectedNode, false); }
        if (nodeId) { Graph.setNodeSelected(g, nodeId, true); }
        selectedNode = nodeId;
      };

      return self;
    }
  });

  m.factory('WorkflowGraphApi', function() {
    var onSelectNodeListeners = [];

    var api = {};
    api.onSelectNode = onSelectNode;
    api.registerOnSelectNodeListener = registerOnSelectNodeListener;
    return api;

    function onSelectNode(nodeId) {
      _.forEach(onSelectNodeListeners, function(fn) { fn(nodeId); });
    }

    function registerOnSelectNodeListener(fn) { onSelectNodeListeners.push(fn); }
  });

export default m.name;
