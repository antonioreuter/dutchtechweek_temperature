'use strict'

const electron = require('electron');
const url = require('url');
const path = require('path');
const control = require('./control');
const lampHue = require('./lampHue');
const lightUtils = require('./lightUtils');
const {
    appEventEmitter, START_QUERY_DATA_EVENT, GAME_STOPPED, CHANGE_DATA_EVENT, UPDATE_COUNTDOWN_EVENT, UPDATE_COUNTDOWN_EVENT2, GAME_OVER, INIT_BMP_EVENT 
} = require('./appEventEmitter');


const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;

app.commandLine.appendSwitch('remote-debugging-port', '8500')
app.commandLine.appendSwitch('host-rules', 'MAP * 127.0.0.1')

app.on('ready', () => {
    console.log('Starting the application...');
    mainWindow = new BrowserWindow({ width: 1500, height: 800, backgroundColor: '#CCCCCC' });
    mainWindow.loadURL(`file://${__dirname}/mainWindow.html`);

    mainWindow.on('closed', () => {
        console.log('quit! bye, bye...');
        app.quit();
    });
});

ipcMain.on('screen:load', (event, val) => {
    console.log('Sending message to START the measurements...');
    lampHue.resetLamps();
    control.start();
});


appEventEmitter.on(CHANGE_DATA_EVENT, (data) => {
    console.log(`Updating the screen with the latest data: ${JSON.stringify(data)}`);

    if (data !== undefined) {
        mainWindow.webContents.send('screen:update', data);

        data.forEach(element => {
            if (element.lightBulbID !== -1) {
                lampHue.emitPlayerLampSignal(element.lightBulbID, element.color);
            }
        });
    }
});