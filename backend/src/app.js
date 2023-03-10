const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const ds = require("./datasource.js");
require("dotenv").config();

const port = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());

const server = http.createServer(app);

ds.startWebsocketServer(server);
ds.connectDatabase();

server.listen(port);
console.log(`Listening on http://localhost:${port}`);
