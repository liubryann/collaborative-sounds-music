const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const ds = require("./datasource.js");
const userRouter = require("./routers/usersRouter.js");
require("dotenv").config();

const port = process.env.PORT || 3001;

const app = express();
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "project-dj-chos-disciples-secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/users", userRouter);

const server = http.createServer(app);

ds.startWebsocketServer(server);
ds.setPersistence();

server.listen(port);
console.log(`Listening on http://localhost:${port}`);
