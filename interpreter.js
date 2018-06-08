const { appEventEmitter, CHANGE_DATA_EVENT, START_QUERY_DATA_EVENT, GAME_STOPPED, GAME_OVER, STOP_MEASURING_INIT_BPM, START_MEASURING_INIT_BPM, INIT_BMP_EVENT, WINNER_FOUND_EVENT } 
= require('./appEventEmitter');
const lightUtils = require('./lightUtils');
const outliers = require('outliers');
const config = require('./config.json');

const HEARTBEAT_THRESHOLD_MIN = 30;
const HEARTBEAT_THRESHOLD_MAX = 300;

class Interpreter {
  constructor() {
    this.data = new Map();
    this.initialHeartbeat = new Map();
    this.isQueryingData = false;
    appEventEmitter.on(START_MEASURING_INIT_BPM, () => {
      this.data.clear();
    });
    appEventEmitter.on(STOP_MEASURING_INIT_BPM, () => {
      this.setInitialHeartbeat();
    });
    appEventEmitter.on(START_QUERY_DATA_EVENT, () => {
      this.data.clear();
      this.isQueryingData = true;
    });
    appEventEmitter.on(GAME_STOPPED, () => {
      this.data.clear();
      this.isQueryingData = false;
    });
    appEventEmitter.on(GAME_OVER, () => {
      this.data.clear();
      this.isQueryingData = false;
    });
  }

  filterRecords(records) {
    if (!Array.isArray(records)) {
      return [];
    }

    const items = records.filter((x) => {
      return x.data.bpm > HEARTBEAT_THRESHOLD_MIN && x.data.bpm < HEARTBEAT_THRESHOLD_MAX;
    });
    const bpmData = items.map(x => ({ 
      id: x.id,
      bpm: x.data.bpm
    }));
    const filteredBPMData = bpmData.filter(outliers('bpm'));
    const fm = new Set(filteredBPMData.map(x => x.id));
    return items.filter(x => fm.has(x.id)); 
  }

  addRecords(records) {
    const oldSize = this.data.size;
    records = this.filterRecords(records);
    records.forEach((x) => {
      this.data.set(x.id, x);
    });
    const currentSize = this.data.size;
    if (oldSize !== currentSize) {
      if (this.isQueryingData) {
        const playerPayload = this.getLatestPlayerData();
        const payload = playerPayload.map(x => ({
          playerID: x.playerID,
          playerName: this.findPlayerName(x.playerID),
          lightBulbID: this.findLightBulbID(x.playerID),
          color: lightUtils.calculateHueColorNumber(this.getInitialHeartbeat(x.playerID), x.data.bpm),
          data: {
            bpm: `${Math.round(x.data.bpm)}`
          }
        }));
        const winners = payload.filter(x => x.color === 0);
        appEventEmitter.emit(CHANGE_DATA_EVENT, payload);
        if (winners.length > 0) {
          appEventEmitter.emit(WINNER_FOUND_EVENT, winners[0]);
        }
      }
    }
  }

  setInitialHeartbeat() {
    this.initialHeartbeat = this.computeInitialHeartbeat();
    const result = Array.from(this.initialHeartbeat.values());
    appEventEmitter.emit(INIT_BMP_EVENT, result);
    console.log('Initial heartbeat', result);
  }

  getInitialHeartbeat(playerID) {
    return this.initialHeartbeat.has(playerID) ? this.initialHeartbeat.get(playerID).averageBPM : 1;
  }

  findLightBulbID(playerID) {
    for (let i = 0; i < config.players.length; i++) {
      let player = config.players[i];
      if (player.id === playerID) {
        return player.lightBulbID;
      }
    }
    return -1;
  }

  findPlayerName(playerID) {
    for (let i = 0; i < config.players.length; i++) {
      let player = config.players[i];
      if (player.id === playerID) {
        return player.name;
      }
    }
    return 'Unknown player';
  }

  computeInitialHeartbeat() {
    const items = Array.from(this.data.values());
    const playerData = new Map();
    items.forEach((x) => {
      if (!playerData.has(x.playerID)) {
        playerData.set(x.playerID, {
          sum: x.data.bpm,
          n: 1,
          minBPM: x.data.bpm,
          maxBPM: x.data.bpm          
        });
      } else {
        const current = playerData.get(x.playerID);
        playerData.set(x.playerID, {
          sum: current.sum + x.data.bpm,
          n: current.n + 1,
          minBPM: Math.min(x.data.bpm, current.minBPM),
          maxBPM: Math.max(x.data.bpm, current.maxBPM)          
        });
      }

    });
    const result = new Map();
    playerData.forEach((value, key) => {
      result.set(key, {
        playerID: key,
        averageBPM: value.sum / value.n,
        minBPM: value.minBPM,
        maxBPM: value.maxBPM
      })
    });
    return result;
  }

  getLatestPlayerData() {
    const items = Array.from(this.data.values());
    const playerData = new Map();
    const result = [];
    items.forEach((x) => {
      if (!playerData.has(x.playerID)) {
        playerData.set(x.playerID, x);
      } else {
        const currentLatest = playerData.get(x.playerID);
        if (currentLatest.timestamp < x.timestamp) {
          playerData.set(x.playerID, x);
        }
      }

    });
    return Array.from(playerData.values());
  }
}

const interpreter = new Interpreter();

module.exports = interpreter;