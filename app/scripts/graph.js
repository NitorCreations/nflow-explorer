'use strict';

function nodeDomId(nodeId) {
  return 'node_' + nodeId;
}
function edgeDomId(edgeId) {
  return 'edge' + edgeId;
}

function disableZoomPan() {
  var svg =  d3.select('svg');

  // panning off
  svg.on('mousedown.zoom', null);
  svg.on('mousemove.zoom', null);
  // zooming off
  svg.on('dblclick.zoom', null);
  svg.on('touchstart.zoom', null);
  svg.on('wheel.zoom', null);
  svg.on('mousewheel.zoom', null);
  svg.on('MozMousePixelScroll.zoom', null);
}

function activeNode(workflow, state) {
  if(!workflow) {
    return true;
  }
  if(workflow.state === state.name) {
    return true;
  }
  return !!_.find(workflow.actions, function(action) {
    return action.state === state.name;
  });
}

function activeTransition(workflow, state, transition) {
  if(!workflow) {
    return true;
  }
  if(workflow.actions.length < 2) {
    return false;
  }

  var first = null;
  var found =  _.find(workflow.actions, function(action) {
    if(!first) {
      first = action.state;
      return false;
    }
    if(first === state.name && action.state === transition) {
      return true;
    }
    first = action.state;
  });
  if(found) {
    return found;
  }
  return _.last(workflow.actions).state === state.name && workflow.state === transition;
}

function nodeEdges(graph, nodeId) {
  var inEdges = _.flatten(_.map(graph._inEdges[nodeId], function(e) {
    return e.keys();
  }));
  var outEdges = _.flatten(_.map(graph._outEdges[nodeId], function(e) {
    return e.keys();
  }));
  return _.flatten([inEdges, outEdges]);
}

function removeClass(node, className) {
  // TODO not complete with all corner cases
  var value = node.attr('class');
  if(!value) {
    return node;
  }
  node.attr('class', value.replace(new RegExp(className, 'g')));
  return node;
}

// AngularJS's jqLite doesn't have removeClass/addClass
function addClass(node, className) {
  // TODO not complete with all corner cases
  removeClass(node, className);
  var value = node.attr('class');
  if(!value) {
    node.attr('class', className);
    return node;
  }
  if(value.indexOf(className) > -1) {
    return node;
  }
  node.attr('class', value + ' ' + className);
  return node;
}

function highlightEdges(graph, nodeId, workflow) {
  function hilight(source,target) {
    var strokeWidth = '5px';
    if(workflow && activeTransition(workflow, {name: source}, target) ) {
      strokeWidth = '7px';
    }
    _.each(graph.incidentEdges(source, target), function(edgeId) {
      addClass($('#' + edgeDomId(edgeId)), 'selected');
    });
  }
  _.each(graph.predecessors(nodeId), function(prev) {
    hilight(prev, nodeId);
  });
  _.each(graph.successors(nodeId), function(next) {
    hilight(nodeId, next);
  });
}

function unhighlightEdges(graph, nodeId, workflow) {
  function unhilight(source,target) {
    var strokeWidth = '1px';
    if(workflow && activeTransition(workflow, {name: source}, target) ) {
      strokeWidth = '2px';
    }
    _.each(graph.incidentEdges(source, target), function(edgeId) {
      removeClass($('#' + edgeDomId(edgeId)), 'selected');
    });
  }
  _.each(graph.predecessors(nodeId), function(prev) {
    unhilight(prev, nodeId);
  });
  _.each(graph.successors(nodeId), function(next) {
    unhilight(nodeId, next);
  });
}

function higlightNode(graph, definition, nodeId, workflow) {
  highlightEdges(graph, nodeId, workflow);

  addClass($('#' + nodeDomId(nodeId)), 'selected');
  var state = _.find(definition.states,
                     function(state) {
                       return state.id === nodeId;
                     });
  state.selected = 'highlight';
}

function unhiglightNode(graph, definition, nodeId, workflow) {
  unhighlightEdges(graph, nodeId, workflow);
  removeClass($('#' + nodeDomId(nodeId)), 'selected');
  _.each(definition.states, function(state) {
    state.selected = undefined;
  });
}

/**
 * Count how many times this state has been retried. Including non-consecutive retries.
 */
function calculateRetries(workflow, state) {
  var retries = 0;
  if(workflow) {
    _.each(workflow.actions, function(action) {
      if(action.state === state.id && action.retryNo > 0)  {
        retries ++;
      }});
  }
  return retries;
}

function createNodeStyle(state, workflow, unexpected) {
  var active = activeNode(workflow, state);
  var labelStroke = '';
  var boxStroke = 'black';
  var strokeWidth = '3px';
  if(!active) {
    boxStroke = 'gray';
    labelStroke = 'fill: gray;';
    strokeWidth = '1.5px';
  }
  if(!workflow) {
    strokeWidth = '1.5px';
  }
  if(unexpected) {
    boxStroke = 'red';
    labelStroke = 'fill: red;';
  }
  var normalNodeStyle = {'class': 'node-normal'};
  var startNodeStyle ={'class': 'node-start'};
  var errorNodeStyle = {'class': 'node-error'};
  var endNodeStyle = {'class': 'node-end'};

  var nodeStyle = {'class': 'node-normal'};
  if(state.type === 'start') {
    nodeStyle = {'class': 'node-start'};
  }
  if(state.type === 'manual') {
    nodeStyle = {'class': 'node-manual'};
  }
  if(state.type === 'end') {
    nodeStyle = {'class': 'node-end'};
  }
  if(state.type === 'error') {
    nodeStyle = {'class': 'node-error'};
  }
  if(workflow && !active) {
    nodeStyle['class'] += ' node-passive';
  }

  nodeStyle.retries = calculateRetries(workflow, state);
  nodeStyle.state = state;
  nodeStyle.label = state.name;
  return nodeStyle;
}

function createEdgeStyle(workflow, definition, state, transition, genericError) {
  if(!workflow) {
    if(genericError) {
      return {'class': 'edge-error'};
    }
    return {'class': 'edge-normal'};
  }
  if(activeTransition(workflow, state, transition)) {
    if(genericError) {
      return {'class': 'edge-error edge-active'};
    }
    return {'class': 'edge-normal edge-active'};
  } else {
    if(genericError) {
      return {'class': 'edge-error edge-passive'};
    }
    return {'class': 'edge-normal edge-passive'};
  }
}

function addUnexpectedNodes(g, workflow) {
  if(!workflow) {
    return;
  }
  _.each(workflow.actions, function(action) {
    if(g._nodes[action.state]) {
      return;
    }
    var nodeStyle = createNodeStyle({name: action.state}, workflow, true);
    g.addNode(action.state, nodeStyle);
  });
}

function addUnexpectedEdges(g, workflow) {
  if(!workflow) {
    return;
  }
  var activeEdges = {};
  var sourceState = null;
  _.each(workflow.actions, function(action) {
    if(!activeEdges[action.state]) {
      activeEdges[action.state] = {};
    }
    if(!sourceState) {
      sourceState = action.state;
      return;
    }

    // do not include retries
    if(sourceState !== action.state) {
      activeEdges[sourceState][action.state] = true;
    }
    sourceState = action.state;
  });

  // handle last action -> currentAction, do not include retries
  var lastAction = _.last(workflow.actions);
  if(lastAction && lastAction.state !== workflow.state) {
    activeEdges[lastAction.state][workflow.state] = true;
  }

  _.each(activeEdges, function(targetObj, source) {
    _.each(Object.keys(targetObj), function(target) {
      if(!target) { return; }
      if(!g.inEdges(target, source).length) {
        g.addEdge(null, source, target,
                  {'class': 'edge-unexpected edge-active'});
      }
    });
  });
}

function markCurrentState(workflow) {
  addClass($('#' + nodeDomId(workflow.state)), 'current-state');
}


function workflowDefinitionGraph(definition, workflow) {
  var g = new dagreD3.Digraph();
  // All nodes must be added to graph before edges
  for(var i in definition.states) {
    var state = definition.states[i];

    var nodeStyle = createNodeStyle(state, workflow);
    g.addNode(state.name, nodeStyle);
  }
  // Add nodes not in workflow definition
  addUnexpectedNodes(g, workflow);

  // Add edges
  for(var edgeIndex in definition.states) {
    var state = definition.states[edgeIndex];
    for(var k in state.transitions){
      var transition = state.transitions[k];
      g.addEdge(null, state.name, transition,
                createEdgeStyle(workflow, definition, state, transition));
    }
    if(state.onFailure) {
      g.addEdge(null, state.name, state.onFailure,
                createEdgeStyle(workflow, definition, state, state.onFailure, true));

    }
  }

  // Add edges to generic onError state
  var errorStateName = definition.onError;
  _.each(definition.states, function(state) {
    if(state.name === errorStateName || state.onFailure || state.type === 'end') {
      return;
    }
    if(_.contains(state.transitions, errorStateName)) {
      return;
    }
    g.addEdge(null, state.name, errorStateName,
              createEdgeStyle(workflow, definition, state, errorStateName, true));
  });

  // add edges that are not present in workflow definition
  addUnexpectedEdges(g, workflow);
  return g;
}

function addArrowheadMarker(canvasId, id, color) {
  d3.select('#' + canvasId).select('defs')
    .append('marker')
    .attr('id', id)
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 8)
    .attr('refY', '5')
    .attr('markerUnits', 'strokeWidth')
    .attr('markerWidth', '8')
    .attr('markerHeight', '5')
    .attr('orient', 'auto')
    .attr('fill', color)
    .append('path')
       .attr('d', 'M 0 0 L 10 5 L 0 10 z');
}

function drawWorkflowDefinition(graph, canvasId, nodeSelectedCallBack, embedCSS) {
  var renderer = new dagreD3.Renderer();
  var oldDrawNodes = renderer.drawNodes();
  renderer.drawNodes(
    function(g, root) {
      var nodes = oldDrawNodes(graph, root);

      // use hand mouse cursor for nodes
      nodes.attr('style',
                 function(e) {
                   return 'opacity: 1;cursor: pointer;';
                 });
      nodes.append('title').text(function(nodeId){
        var node = g.node(nodeId);
        return  capitalize(node.state.type) + ' state\n' +
          node.state.description;
      });
      // add id attr to nodes g elements
      nodes.attr('id', function(nodeId) {
                                  return nodeDomId(nodeId);
                                });
      nodes.attr('class', function(nodeId) {
        // see createEdgeStyle, class is not supported attribute
        return g.node(nodeId)['class'];
      });

      // draw retry indicator
      // fetch sizes for node rects => needed for calculating right edge for rect
      var nodeCoords = {};
      nodes.selectAll('rect').each(function (nodeName) {
        var t = d3.select(this);
        nodeCoords[nodeName] = {x: t.attr('x'), y: t.attr('y')};
      });

      // orange ellipse with retry count
      var retryGroup = nodes.append('g');
      retryGroup.each(function(nodeId) {
        var node = g.node(nodeId);
        if(node.retries > 0) {
          var c = nodeCoords[nodeId];
          var t = d3.select(this);
          t.attr('transform', 'translate(' + (- c.x) + ',-4)');

          t.append('ellipse')
          .attr('cx', 10).attr('cy', -5)
          .attr('rx', 20).attr('ry', 10)
          .attr('class', 'retry-indicator');

          t.append('text')
          .append('tspan')
          .text(node.retries);

          t.append('title').text('State was retried ' + node.retries + ' times.');
        }
      });
      // event handler for clicking nodes
      nodes.on('click', function(nodeId) {
        nodeSelectedCallBack(nodeId);
      });
      return nodes;
    });

  var oldDrawEdgePaths = renderer.drawEdgePaths();
  renderer.drawEdgePaths(
    function(g, root) {
      var edges = oldDrawEdgePaths(g, root);
      // add id to edges
      edges.selectAll('*').attr('id', function(edgeId) {
        return edgeDomId(edgeId);
      })
      .attr('class', function(edgeId) {
        // see createEdgeStyle, class is not supported attribute
        return g._edges[edgeId].value.class;
      });
      return edges;
    });

  var svgRoot = d3.select('#' + canvasId);
  // remove any existing graphs
  svgRoot.selectAll("*").remove();
  // add embedded CSS
  svgRoot.append('style')
        .attr('type', 'text/css')
        .text(embedCSS);
  var svgGroup = svgRoot.append('g');

  // render svg
  var layout = renderer.run(graph, svgGroup);

  addArrowheadMarker(canvasId, 'arrowhead-gray', 'gray');
  addArrowheadMarker(canvasId, 'arrowhead-red', 'red');

  var svgBackground = svgRoot.select('rect.overlay');
  svgBackground.attr('style', '');
  svgBackground.attr('class', 'graph-background');
  svgBackground.on('click', function() {
    // event handler for clicking outside nodes
    nodeSelectedCallBack(null);
  });


  svgGroup.attr('transform', 'translate(20, 20)');
  svgRoot.attr('preserveAspectRatio', 'xMinYMin meet');
  svgRoot.attr('viewBox', '0 0 ' + (layout.graph().width+40) + ' ' + (layout.graph().height+40));
  //class to make it responsive
  svgRoot.classed('svg-content-responsive', true);

  disableZoomPan();
  return layout;
}

function downloadDataUrl(dataurl, filename) {
  var a = document.createElement('a');
  // http://stackoverflow.com/questions/12112844/how-to-detect-support-for-the-html5-download-attribute
  // TODO firefox supports download attr, but due security doesn't work in our case
  if('download' in a) {
    console.debug('Download via a.href,a.download');
    a.download = filename;
    a.href = dataurl;
    a.click();
  } else {
    console.debug('Download via location.href');
    // http://stackoverflow.com/questions/12676649/javascript-programmatically-trigger-file-download-in-firefox
    location.href = dataurl;
  }
}

function downloadImage(dataurl, filename, contentType) {
  console.info('Downloading image', filename, contentType);
  var canvas = document.createElement('canvas');

  var context = canvas.getContext('2d');
  var svg = $('svg');
  canvas.height = svg.attr('height');
  canvas.width = svg.attr('width');
  var image = new Image();
  image.onload = function() {
    // image load is async, must use callback
    context.drawImage(image, 0, 0);
    var canvasdata = canvas.toDataURL(contentType);
    downloadDataUrl(canvasdata, filename);
  };
  image.onerror = function(error) {
    console.error('Image downloading failed', error);
  };
  image.src = dataurl;
}
