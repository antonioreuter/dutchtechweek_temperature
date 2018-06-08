const moment = require('moment');

class Service {
  constructor(config) {
    this.config = Object.assign({}, config);
    this.lastQueryTimestamp = moment();    
  }

  resetLastQueryTimestamp(timestamp = moment()) {
    this.lastQueryTimestamp = timestamp;
  }

  query() {
    return Promise.reject('Please define the query function');
  }
}

module.exports = Service;