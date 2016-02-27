import angular from 'angular';

'use strict';

  var m = angular.module('nflowExplorer.search.searchForm', []);

  m.directive('searchForm', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        results: '=',
        definitions: '='
      },
      bindToController: true,
      controller: 'SearchFormCtrl',
      controllerAs: 'ctrl',
      template: require('./searchForm.html')
    };
  });

  m.controller('SearchFormCtrl', function($timeout, CriteriaModel, WorkflowSearch, WorkflowInstanceStatus) {
    var self = this;
    self.showIndicator = false;
    self.instanceStatuses = _.values(WorkflowInstanceStatus);
    self.model = CriteriaModel.model;
    self.search = search;
    self.onTypeChange = CriteriaModel.onDefinitionChange;
    self.spinnerUrl = require('images/spinner.gif');
    initialize();

    function initialize() {
      if (!CriteriaModel.isEmpty()) {
        search();
      }
    }

    function search() {
      var t = $timeout(function() { self.showIndicator = true; }, 500);
      self.results = WorkflowSearch.query(CriteriaModel.toQuery());
      self.results.$promise.then(hideIndicator, hideIndicator);

      function hideIndicator() {
        $timeout.cancel(t);
        self.showIndicator = false;
      }
    }
  });

export default m.name;
