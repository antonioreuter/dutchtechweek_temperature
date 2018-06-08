const config = require('./config.json');

const HueColorValueGreen = 25500;
const IncreasePercentage = config.increasePercentage;
const SIGNAL_LAMP = 2;
const SENSOR1_LAMP = config.sensors[0].lightBulbID;
const SENSOR2_LAMP = config.sensors[1].lightBulbID;

const minTemperature = config.temperatureLevels[0];
const maxTemperature = config.temperatureLevels[1];


const calculateHueColorNumberOLD = (currentTemperature) => {
  normalizedTemperature = Math.min(currentTemperature, maxTemperature);
  normalizedTemperature = Math.max(normalizedTemperature, minTemperature);

  result = Math.round(((1 - ((normalizedTemperature - minTemperature) / (maxTemperature - minTemperature))) * HueColorValueGreen));
  return result;
};

const calculateHueColorNumber = (temperature) => {
  const temp = Math.abs(temperature - minTemperature);
  const maxTemp = maxTemperature - minTemperature;
  const index = (temp * 100) / maxTemp;
  console.log(`### CALCULATE COLOR: TEMPERATURE: ${temperature}, INDEX: ${index}. COLOR: ${((index * 10) + HueColorValueGreen)}`);
  return (index * 3)  + HueColorValueGreen;
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