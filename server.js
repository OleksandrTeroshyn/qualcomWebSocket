const WebSocket = require('ws');
const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

const wsServer = new WebSocket.Server({ server });

wsServer.on('connection', onConnect);

function onConnect(socket) {
    console.log('A client connected');

    socket.on('message', (message) => {
        console.log(`Received message: ${message}`);
        // Do something with the received message if needed
    });

    socket.on('close', () => {
        console.log('A client disconnected');
    });
}

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});