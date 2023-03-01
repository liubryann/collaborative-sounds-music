import express from "express";
import http from "http";
import bodyParser from "body-parser";
import backend from "./datasource";
import WebSocket from "ws";
import WebSocketJSONStream from "@teamwork/websocket-json-stream";

let server: http.Server;
const PORT: number = 3001;

const app = express();
app.use(bodyParser.json());

server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server: server });

webSocketServer.on("connection", (webSocket) => {
  var stream = new WebSocketJSONStream(webSocket);
  backend.listen(stream);
});

server.listen(PORT);
console.log(`Listening on http://localhost:${PORT}`);
