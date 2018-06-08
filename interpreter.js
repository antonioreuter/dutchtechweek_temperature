const { appEventEmitter, CHANGE_DATA_EVENT, START_QUERY_DATA_EVENT, STOP_QUERY_DATA_EVENT } 
  = require('./appEventEmitter');
const lightUtils = require('./lightUtils');
const outliers = require('outliers');
const config = require('./config.json');

class Interpreter {
  constructor() {
    this.data = new Map();
    this.latestSensorData = new Map();
    this.isQueryingData = false;
    appEventEmitter.on(START_QUERY_DATA_EVENT, () => {
      this.data.clear();
      this.isQueryingData = true;
    });
    appEventEmitter.on(STOP_QUERY_DATA_EVENT, () => {
      this.data.clear();
      this.isQueryingData = false;
    });
  }

  addRecords(records) {
    const oldSize = this.data.size;
    records.forEach((x) => {
      this.data.set(x.id, x);
    });
    if (this.isQueryingData) {
      const sensorPayload = this.getLatestSensorData();
      const payload = sensorPayload.map(x => ({
        sensorID: x.sensorID,
        sensorName: this.findSensorName(x.sensorID),
        lightBulbID: this.findLightBulbID(x.sensorID),
        color: lightUtils.calculateHueColorNumber(x.data.temperature),
        data: {
          temperature: x.data.Temperature.toFixed(2),
          humidity: x.data.Humidity.toFixed(2)
        }
      }));
      appEventEmitter.emit(CHANGE_DATA_EVENT, payload);
      this.data.clear();
    }
  }

  findLightBulbID(sensorID) {
    for (let i = 0; i < config.sensors.length; i++) {
      let sensor = config.sensors[i];
      if (sensor.id === sensorID) {
        return sensor.lightBulbID;
      }
    }
    return -1;
  }

  findSensorName(sensorID) {
    for (let i = 0; i < config.sensors.length; i++) {
      let sensor = config.sensors[i];
      if (sensor.id === sensorID) {
        return sensor.name;
      }
    }
    return 'Unknown sensor';
  }

  getLatestSensorData() {
    const items = Array.from(this.data.values());
    const sensorData = new Map(this.latestSensorData);
    const result = [];
    items.forEach((x) => {
      if (!sensorData.has(x.sensorID)) {
        sensorData.set(x.sensorID, x);
        this.latestSensorData.set(x.sensorID, x);
      } else {
        const currentLatest = sensorData.get(x.sensorID);
        if (currentLatest.timestamp < x.timestamp) {
          sensorData.set(x.sensorID, x);
          this.latestSensorData.set(x.sensorID, x);
        }
      }

    });
    return Array.from(sensorData.values());
  }
}

const interpreter = new Interpreter();

module.exports = interpreter;