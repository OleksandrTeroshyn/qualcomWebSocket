'use strict';

const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
    .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on('connection', onConnect);

const roomList = [];

function onConnect(socket) {

    socket.on('close', function () {
        console.log('[Log   ] User disconnect');
    });

    socket.on('message', function (message) {
        message = new TextDecoder('utf-8').decode(message);
        console.log('[Recive] ' + message);

        try {
            const data = JSON.parse(message);

            switch (data.Type) {
                case 'generate': {
                    let code = generateRoomNameCode();
                    while (roomList.includes(code)) {
                        code = generateRoomNameCode();
                    }
                    roomList.push(code);
                    console.log('[Log   ] generated: ' + code + ' | roomList :', roomList);
                    socket.send(JSON.stringify({ Type: 'generated', Data: code }));
                    break;
                }
                case 'check': {
                    const code = data.Data.toLowerCase();
                    const exists = roomList.includes(code);
                    console.log('[Log   ] "' + code + '"' + (exists ? ' found' : ' not found') + '| roomList :', roomList);
                    socket.send(JSON.stringify({ Type: 'checked', Data: exists }));
                    break;
                }
                case 'remove': {
                    const code = data.Data.toLowerCase();
                    if (roomList.indexOf(code) !== -1) {
                        roomList.splice(roomList.indexOf(code), 1);
                        console.log('[Log   ] ' + code + ' removed  | roomList :', roomList);
                    } else {
                        console.log('[Log   ] ' + code + ' not found  | roomList :', roomList);
                    }
                    break;
                }
            }
        } catch (error) {
            console.log('Error', error);
        }
    });
}

console.log(`Server Started on port Listening on ${PORT}`);

function generateRoomNameCode() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    const number = Math.floor(Math.random() * 900) + 100;
    return `${letter}${number}`;
}