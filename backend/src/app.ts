import express from "express";
import bodyParser from "body-parser";
import ShareDB from "sharedb";
import WebSocket from "ws";
import http from "http";
import WebSocketJSONStream from "@teamwork/websocket-json-stream";
import { MongoClient, ServerApiVersion } from "mongodb";

const PORT = 3001;
//Maybe hide this but eh.

const uri =
  "mongodb+srv://username:chosdisiples@cluster-project.znjjqvk.mongodb.net/?retryWrites=true&w=majority";
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
};
const client = new MongoClient(uri, options);
let backend;
try {
  const db = client.connect();
  backend = new ShareDB({ db });
  console.log("Successful database connection.");
} catch {
  console.error("Failed to connect to database");
}

export const app = express();

const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({ server: server });
app.use(bodyParser.json());

webSocketServer.on("connection", (webSocket) => {
  var stream = new WebSocketJSONStream(webSocket);
  backend.listen(stream);
});

server.listen(PORT);
console.log(`Listening on http://localhost:${PORT}`);
