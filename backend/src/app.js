const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const session = require("express-session");
const ds = require("./datasource.js");
const { userRouter } = require("./routes/usersRouter.js");
const { compositionRouter } = require("./routes/compositionsRouter.js");
const { aiRouter } = require("./routes/aiRouter.js");
const dotenv = require("dotenv");
const cors = require("cors");
const Sentry = require("@sentry/node");

dotenv.config();

const port = process.env.PORT;

const app = express();
Sentry.init({ dsn: process.env.SENTRY_DSN });

app.use(Sentry.Handlers.requestHandler());
app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      if (error.status >= 400) {
        return true;
      }
    },
  })
);
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

app.use("/api/users", userRouter);
app.use("/api/compositions", compositionRouter);
app.use("/api/ai", aiRouter);

const server = http.createServer(app);

ds.startWebsocketServer(server);
ds.ySetPersistence();
ds.connectDatabase().then(() => {
  server.listen(port);
  console.log(`Listening on port ${port}`);
});
