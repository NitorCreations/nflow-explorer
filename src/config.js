'use strict';
var Config = {
  //nflowUrl: 'http://localhost:7500/api/',
  nflowUrl: 'http://bank.nflow.io/nflow/api',

  nflowApiDocs: 'http://localhost:7500/doc/',
  //nflowApiDocs = 'http://nbank.dynalias.com/nflow/doc/';

  radiator: {
    // poll period in seconds
    pollPeriod: 15,
    // max number of items to keep in memory
    maxHistorySize: 10000
  }
};
