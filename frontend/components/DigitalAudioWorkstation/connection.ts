import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

let wsProvider: WebsocketProvider;
let doc: Y.Doc = new Y.Doc(); // TODO: exporting and resetting doc in connectAndSyncDoc is a hack
const url: string = "ws://localhost:3001";

/**
 * Connects to the websocket server and syncs the document.
 */
function connectAndSyncDoc(room: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    doc = new Y.Doc();
    wsProvider = new WebsocketProvider(url, room, doc);
    const awareness = wsProvider.awareness;

    wsProvider.on("status", (event: { status: any }) => {
      console.log(event.status); // logs "connected" or "disconnected"
    });

    const pollConnected = setInterval(() => {
      if (wsProvider.wsconnected) {
        clearInterval(pollConnected);
        resolve(awareness);
      }
    }, 1000);
  });
}

export { connectAndSyncDoc, doc, Y };
