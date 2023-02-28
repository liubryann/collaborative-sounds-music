import express, { Express } from 'express';
import bodyParser from 'body-parser';
import ShareDB from 'sharedb';
import WebSocket from 'ws';
import http from 'http';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';

const PORT = 3000;
const backend = new ShareDB();

export const app: Express = express();

const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({server:server});

app.use(bodyParser.json());

webSocketServer.on('connection', (webSocket) => {
  var stream = new WebSocketJSONStream(webSocket)
  backend.listen(stream)
})

server.listen(PORT);
console.log(`Listening on http://localhost:${PORT}`);
