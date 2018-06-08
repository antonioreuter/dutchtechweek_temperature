const config = require('./config.json');

const HueColorValueGreen = 25500;
const IncreasePercentage = config.increasePercentage;
const SIGNAL_LAMP = 2;
const SENSOR1_LAMP = config.sensors[0].lightBulbID;
const SENSOR2_LAMP = config.sensors[1].lightBulbID;

const minTemperature = config.temperatureLevels[0];
const maxTemperature = config.temperatureLevels[1];

const calculateHueColorNumber = (temperature) => {
  normalizedTemperature = Math.min(temperature, maxTemperature);
  normalizedTemperature = Math.max(normalizedTemperature, minTemperature);

  result = Math.round(((1 - ((normalizedTemperature - minTemperature) / (maxTemperature - minTemperature))) * HueColorValueGreen));

  return result;
};


const calculateHueColorNumberXXXX = (temperature) => {
  const temp = Math.abs(temperature - minTemperature);
  const maxTemp = maxTemperature - minTemperature;
  const index = (temp * 100) / maxTemp;
  console.log(`### CALCULATE COLOR: TEMPERATURE: ${temperature}, INDEX: ${index}. COLOR: ${((index * 10) + HueColorValueGreen)}`);
  let color = HueColorValueGreen
 
  if (index >= 33 && index < 66) color = 12750; 
  else if (index >= 66 && index < 90) color = 56100;
  else if (index >= 90) color = 65280;

  return color;
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