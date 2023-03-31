const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const session = require("express-session");
const ds = require("./datasource.js");
const { userRouter } = require("./routes/usersRouter.js");
const { compositionRouter } = require("./routes/compositionsRouter.js");
const { audioRouter } = require("./routes/audioRouter.js");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();

const port = process.env.PROD_PORT || process.env.DEV_PORT;

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.PUBLIC_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "test",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/users", userRouter);
app.use("/api/compositions", compositionRouter);
app.use("/api/audio", audioRouter);

const server = http.createServer(app);

ds.startWebsocketServer(server);
ds.ySetPersistence();
ds.connectDatabase().then(() => {
  server.listen(port);
  console.log(`Listening on http://localhost:${port}`);
});
