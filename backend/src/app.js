import http from "http";
import express from "express";
import bodyParser from "body-parser";
import session from "express-session";
import * as ds from "./datasource.js";
import { userRouter } from "./routes/usersRouter.js";
import { compositionRouter } from "./routes/compositionsRouter.js";
import dotenv from "dotenv";
dotenv.config();

const port = process.env.PROD_PORT || process.env.DEV_PORT;

const app = express();
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "test",
    resave: false,
    saveUninitialized: true,
  })
);

app.use("/users", userRouter);
app.use("/api/compositions", compositionRouter);

const server = http.createServer(app);

ds.startWebsocketServer(server);
ds.setPersistence();
ds.connectDatabase().then(() => {
  server.listen(port);
  console.log(`Listening on http://localhost:${port}`);
});
