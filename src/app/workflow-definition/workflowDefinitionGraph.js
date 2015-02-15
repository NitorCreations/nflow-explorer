(function () {
  'use strict';

  var m = angular.module('nflowVisApp.workflowDefinition.graph', []);

  m.directive('workflowDefinitionGraph', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        definition: '='
      },
      bindToController: true,
      controller: 'WorkflowDefinitionGraphCtrl',
      controllerAs: 'ctrl',
      templateUrl: 'app/workflow-definition/workflowDefinitionGraph.html'
    };
  });

  m.controller('WorkflowDefinitionGraphCtrl', function($rootScope, $scope, $log, WorkflowDefinitionGraphApi) {
    var svg;
    var graph;

    var self = this;
    self.savePng = savePng;
    self.saveSvg = saveSvg;

    initialize();

    function initialize() {
      svg = initSvg();
      graph = initGraph(self.definition);

      WorkflowDefinitionGraphApi.initialize(graph.nodeSelected);

      var start = new Date().getTime();
      graph.drawWorkflowDefinition();
      $log.debug('Rendering dagre graph took', (new Date().getTime() - start), 'ms');
    }

    function savePng() {
      $log.info('Save PNG');
      graph.doDownload(function() { downloadImage(svg.size(), svg.dataUrl(), self.definition.type + '.png', 'image/png'); });
    }

    function saveSvg() {
      $log.info('Save SVG');
      graph.doDownload(function() { downloadDataUrl(svg.dataUrl(), self.definition.type + '.svg'); });
    }

    function initSvg() {
      var selector = '#dagreSvg';
      var aspectRatio = $(selector).width() / $(selector).height();

      var self = {};
      self.selector = selector;

      self.dataUrl = function() {
        var html = d3.select(selector)
          .attr('version', 1.1)
          .attr('xmlns', 'http://www.w3.org/2000/svg')
          .node().outerHTML;
        return 'data:image/svg+xml;base64,' + btoa(html);
      };

      self.size = function() {
        var h = $(selector).height();
        return [h * aspectRatio, h];
      };

      return self;
    }

    function initGraph(definition) {
      var d = definition;
      var g = workflowDefinitionGraph(d);
      var selectedNode;

      var self = {};

      self.drawWorkflowDefinition = function() {
        drawWorkflowDefinition(g, svg.selector, self.nodeSelected, $rootScope.graph.css);
      };

      self.nodeSelected = function(nodeId) {
        $log.debug('Selecting node ' + nodeId);
        if (selectedNode) { unhiglightNode(g, d, selectedNode); }
        if (nodeId) { higlightNode(g, d, nodeId); }
        selectedNode = nodeId;
      };

      self.doDownload = function(downloadFn) {
        var nodeToRestore = selectedNode;
        self.nodeSelected(null);
        downloadFn();
        self.nodeSelected(nodeToRestore);
      };

      return self;
    }

  });

  m.factory('WorkflowDefinitionGraphApi', function() {
    var onSelectNodeFn = _.noop;

    var api = {};
    api.initialize = initialize;
    api.onSelectNode = onSelectNode;
    return api;

    function initialize(onSelectNodeFnToBind) { onSelectNodeFn = onSelectNodeFnToBind; }
    function onSelectNode(nodeId) { onSelectNodeFn(nodeId); }
  });

})();