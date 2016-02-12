import angular from 'angular';

var m = angular.module('nflowExplorer.search.search', []);

  m.controller('SearchCtrl', function ($stateParams, definitions, CriteriaModel) {
    var self = this;
    self.definitions = definitions;
    self.results = [];
    self.hasResults = hasResults;

    CriteriaModel.initialize({
        type: $stateParams.type,
        stateId: $stateParams.state,
        parentWorkflowId: toInt($stateParams.parentWorkflowId)
      },
      definitions);

    function hasResults() {
      return !_.isEmpty(self.results);
    }

    function toInt(value) {
      try {
        return parseInt(value);
      } catch(e) {
        return undefined;
      }
    }
  });

export default m.name
