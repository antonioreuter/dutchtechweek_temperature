const moment = require('moment');
const config = require('./config.json');
const createService = require('./services/createService');
const lightUtils = require('./lightUtils');
const { appEventEmitter, START_QUERY_DATA_EVENT, STOP_QUERY_DATA_EVENT } = require('./appEventEmitter');

class Control {
  constructor() {
    this.isRunning = false;
    this.intervalID = null;
    this.dataServices = config.services.map(serviceConfig => createService(serviceConfig));
  }

  resetRequestCounter(subtractionS = 0) {
    this.requestCount = 0;
    this.handledRequestCount = 0;
    const timestamp = moment().subtract(subtractionS, 'seconds');
    this.dataServices.forEach(x => x.resetLastQueryTimestamp(timestamp));
  }

  clearTimeouts() {
    if (this.intervalID !== null) {
      clearInterval(this.intervalID);
      this.intervalID = null;
    }
  }

  start() {
    if (this.isRunning) {
      console.error('Cannot start the game, game is already running');
    }
    this.isRunning = true;
    this.clearTimeouts();
    setTimeout(() => {
      this.startQuery();
    }, config.delayMS);
  }

  startQuery() {
    if (!this.isRunning) {
      return;
    }
    appEventEmitter.emit(START_QUERY_DATA_EVENT);
    this.resetRequestCounter();
    this.clearTimeouts();      
    this.invervalID = setInterval(() => {
      this.tick();
    }, config.queryIntervalMS);
  }

  tick() {
    if (!this.isRunning) {
      return;
    }
    this.dataServices.forEach((x) => {
      this.requestCount++;
      x.query()
        .then(() => {
          this.handledRequestCount++;
        })
        .catch(() => {
          this.handledRequestCount++;
        });
    });
  }

  waitForQueries(event = GAME_STOPPED, eventPayload = undefined, limit = 15) {
    setTimeout(() => {
      if (this.handledRequestCount >= this.requestCount || limit <= 0) {
        appEventEmitter.emit(event, eventPayload);
      } else {
        this.waitForQueries(event, eventPayload, limit - 1);
      }
    }, 100);
  }

  stop(event = STOP_QUERY_DATA_EVENT, eventPayload = undefined) {
    if (!this.isRunning) {
      return;
    }
    this.isRunning = false;
    this.clearTimeouts();
    this.waitForQueries(event, eventPayload);
  }
}

const control = new Control();

module.exports = control;