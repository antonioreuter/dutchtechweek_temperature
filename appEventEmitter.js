const EventEmitter = require('events');

const START_QUERY_DATA_EVENT = 'START_QUERY_DATA_EVENT';
const STOP_QUERY_DATA_EVENT = 'STOP_QUERY_DATA_EVENT';
const CHANGE_DATA_EVENT = 'CHANGE_DATA_EVENT';

class AppEventEmitter extends EventEmitter {}

const appEventEmitter = new AppEventEmitter();

module.exports = {
  appEventEmitter,
  START_QUERY_DATA_EVENT,
  STOP_QUERY_DATA_EVENT,
  CHANGE_DATA_EVENT
};