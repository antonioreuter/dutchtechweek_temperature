const config = require('./config.json');

const HueColorValueGreen = 25500;
const IncreasePercentage = config.increasePercentage;
const SIGNAL_LAMP = 2;
const PLAYER1_LAMP = config.players[0].lightBulbID;
const PLAYER2_LAMP = config.players[1].lightBulbID;


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
  PLAYER1_LAMP,
  PLAYER2_LAMP
};