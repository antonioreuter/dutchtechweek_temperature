'use strict';

const config = require('./config.json');
const hue = require("node-hue-api");

const HueApi = hue.HueApi;
const lightState = hue.lightState;

var bridgeIPAddress;

const displayResult = function (result) {
    console.log(JSON.stringify(result, null, 2));
};

const extractBridgeIpAddress = function(bridges) {
    console.log("Hue Bridges Found: " + JSON.stringify(bridges));
    bridgeIPAddress = getBrigde(bridges).ipaddress;
    console.log("Bridge: " + bridgeIPAddress);
    return bridgeIPAddress;
}

const getBrigde = function(bridges) {
    let bridge;
    bridges.forEach(b => {
        if (b.ipaddress.startsWith('192.')) {
            bridge = b;
        };
    });

    if (!bridge) bridge = bridges[0];

    return bridge;
}

class LampHue {
    constructor() {
        var self = this;
        hue.nupnpSearch().then(extractBridgeIpAddress).then((bridgeIPAddress) => {
            self.bridgeApi = new HueApi(bridgeIPAddress, config.bridgeUsername);
        }).done();
    }

    emitSignalLampSignal(signalLampBrightness) {
        const state = lightState.create().on().bri(signalLampBrightness);
        this.sendSignal(config.genericLightBulbID, state);
    }

    emitSensorLampSignal(sensor, color) {
        const state = lightState.create().on().hue(color).sat(255).bri(100);
        this.sendSignal(sensor, state);
    }

    colorLoop(lamp) {
        const state = lightState.create().on().bri(100).colorLoop();
        this.sendSignal(lamp, state);
    }

    resetLamp(lamp) {
        const state = lightState.create().off();
        this.sendSignal(lamp, state);
    }

    turnOn(lamp) {
        const state = lightState.create().on().bri(100);
        this.sendSignal(lamp, state);
    }

    resetLamps() {
        for (let i = 1; i < 4; i++) {
            this.resetLamp(i);
        }
    }

    sendSignal(lamp, state) {
        this.bridgeApi.setLightState(lamp, state)
            .then(displayResult)
            .done();
    }
}

module.exports = new LampHue();