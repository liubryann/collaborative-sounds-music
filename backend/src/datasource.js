import { Sequelize } from "sequelize";
import { MongodbPersistence } from "y-mongodb";
import * as Y from "yjs"; // TODO: investigate double import
import utils from "y-websocket/bin/utils";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.DB_URI;
const collection = process.env.COLLECTION_NAME;
// TODO: Change to Postgres using sequelize to encode and decode document updates
const ldb = new MongodbPersistence(uri, collection);

export const sequelize = new Sequelize(
  process.env.POSTGRES_DB,
  process.env.POSTGRES_USER,
  process.env.POSTGRES_PASSWORD,
  {
    host: process.env.POSTGRES_HOST || "localhost",
    dialect: "postgres",
    storage: process.env.POSTGRES_DATA_PATH,
  }
);

export const startWebsocketServer = function (server) {
  const wss = new WebSocketServer({ noServer: true });

  wss.on("connection", utils.setupWSConnection);
  server.on("upgrade", (request, socket, head) => {
    // You may check auth of request here..
    /**
     * @param {any} ws
     */
    const handleAuth = (ws) => {
      wss.emit("connection", ws, request);
    };
    wss.handleUpgrade(request, socket, head, handleAuth);
  });
};

export const setPersistence = function () {
  utils.setPersistence({
    bindState: async (docName, ydoc) => {
      // Here you listen to granular document updates and store them in the database
      // You don't have to do this, but it ensures that you don't lose content when the server crashes
      // See https://github.com/yjs/yjs#Document-Updates for documentation on how to encode
      // document updates

      const persistedYdoc = await ldb.getYDoc(docName);
      const newUpdates = Y.encodeStateAsUpdate(ydoc);
      ldb.storeUpdate(docName, newUpdates);
      Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
      ydoc.on("update", async (update) => {
        ldb.storeUpdate(docName, update);
      });
    },
    writeState: async (docName, ydoc) => {
      // This is called when all connections to the document are closed.
      // In the future, this method might also be called in intervals or after a certain number of updates.
      return new Promise((resolve) => {
        // When the returned Promise resolves, the document will be destroyed.
        // So make sure that the document really has been written to the database.
        resolve();
      });
    },
  });
};

export const connectDatabase = async function () {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: { drop: false } }); // TODO: Remove before production
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export const endDBConnection = async function () {
  sequelize.close();
};
