const config = require('./config.json');

const HueColorValueGreen = 25500;
const IncreasePercentage = config.increasePercentage;
const SIGNAL_LAMP = 2;
const SENSOR1_LAMP = config.sensors[0].lightBulbID;
const SENSOR2_LAMP = config.sensors[1].lightBulbID;

const minTemperature = config.temperatureLevels[0];
const maxTemperature = config.temperatureLevels[1];


const calculateHueColorNumber = (currentTemperature) => {
  // console.log("Initial heartbeat: " + initialHeartbeat);
  // console.log("Current heartbeat: " + currentTemperature);
  // console.log("Increase Percentage: " + increasePercentage);

  // console.log("Maximum heartbeat: " + maxTemperature);

  normalizedTemperature = Math.min(currentTemperature, maxTemperature);
  normalizedTemperature = Math.max(normalizedTemperature, minTemperature);

  result = Math.round(((1 - ((normalizedTemperature - minTemperature) / (maxTemperature - minTemperature))) * HueColorValueGreen));
  return result;
};

const calculateBrightness = (count) => {
  return count % 2 == 0 ? 0 : 100;
};

module.exports = {
  calculateHueColorNumber,
  calculateBrightness,
  SIGNAL_LAMP,
  SENSOR1_LAMP,
  SENSOR2_LAMP
};