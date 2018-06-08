'use strict';

const bridgeUsername = "JrzPZjkxV8DitLMIZ4PVWjv2h2KGFvYbKvPjOQBY";

const hue = require("node-hue-api");
const HueApi = hue.HueApi;
const lightState = hue.lightState;

var bridgeIPAddress;

const displayResult = function (result) {
    console.log(JSON.stringify(result, null, 2));
};

const extractBridgeIpAddress = function (bridge) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridge));
    bridgeIPAddress = bridge[0].ipaddress;
    console.log("Bridge: " + bridgeIPAddress);
    return bridgeIPAddress;
}

class LampHue {
    constructor() {}

    emitSignalLampSignal(signalLampBrightness) {}

    emitSensorLampSignal(sensor, color) {}

    colorLoop(lamp) {}

    resetLamp(lamp) {}

    resetLamps() {}

    sendSignal(lamp, state) {}
}

module.exports = new LampHue();