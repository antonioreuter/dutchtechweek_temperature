const TDRService = require('./tdrService');

const createService = (serviceConfig) => {
  if (serviceConfig.type === 'tdr') {
    return new TDRService(serviceConfig);
  }
  throw Error("Unknown service type");
};

module.exports = createService;

