const config = require('./config.json');

const HueColorValueGreen = 25500;
const IncreasePercentage = config.increasePercentage;
const SIGNAL_LAMP = 2;
const SENSOR1_LAMP = config.sensors[0].lightBulbID;
const SENSOR2_LAMP = config.sensors[1].lightBulbID;


const calculateHueColorNumber = (initialHeartbeat, currentHeartbeat, increasePercentage = IncreasePercentage) => {
  // console.log("Initial heartbeat: " + initialHeartbeat);
  // console.log("Current heartbeat: " + currentHeartbeat);
  // console.log("Increase Percentage: " + increasePercentage);

  maxHeartbeat = Math.round(initialHeartbeat + initialHeartbeat * (increasePercentage / 100));
  // console.log("Maximum heartbeat: " + maxHeartbeat);

  normalizedHeartbeat = Math.min(currentHeartbeat, maxHeartbeat);
  normalizedHeartbeat = Math.max(normalizedHeartbeat, initialHeartbeat);

  result = Math.round(((1 - ((normalizedHeartbeat - initialHeartbeat) / (maxHeartbeat - initialHeartbeat))) * HueColorValueGreen));
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