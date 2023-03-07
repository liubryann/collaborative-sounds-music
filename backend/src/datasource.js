const http = require("http");
const WebSocket = require("ws");
const Y = require("yjs");
const { MongodbPersistence } = require("y-mongodb");
const utils = require("y-websocket/bin/utils");

//Maybe hide this but eh.
const uri =
  "mongodb+srv://username:chosdisiples@cluster-project.znjjqvk.mongodb.net/?retryWrites=true&w=majority";
const collection = "composition-updates";
const ldb = new MongodbPersistence(uri, collection);

const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("okay");
});

// const wss = new WebSocket.Server({ server });
const wss = new WebSocket.Server({ noServer: true });

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

connectDatabase();

function connectDatabase() {
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
}
module.exports = { server };