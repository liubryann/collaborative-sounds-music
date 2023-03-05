const express = require("express");
const bodyParser = require("body-parser");
const datasource = require("./datasource.js");

const port = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());

datasource.server.listen(port);
console.log(`Listening on http://localhost:${port}`);
