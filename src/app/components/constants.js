import angular from 'angular';

export default angular.module('nflowExplorer.constants', [])
  .constant('WorkflowStateType', {
    START: 'start',
    MANUAL: 'manual',
    NORMAL: 'normal',
    END: 'end',
    ERROR: 'error'
  })
  .constant('WorkflowInstanceStatus', {
    CREATED: 'created',
    IN_PROGRESS: 'inProgress',
    FINISHED: 'finished',
    MANUAL: 'manual'
  }).name;

