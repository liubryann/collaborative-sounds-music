import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

let wsProvider: WebsocketProvider;
let doc: Y.Doc = new Y.Doc();
const url: string = "ws://localhost:3001";

/**
 * Connects to the websocket server and syncs the document.
 */
function connectAndSyncDoc(room: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    wsProvider = new WebsocketProvider(url, room, doc);

    wsProvider.on("status", (event: { status: any; }) => {
      console.log(event.status); // logs "connected" or "disconnected"
    });

    setInterval(() => {
      if (wsProvider.wsconnected) {
        resolve();
      }
    }, 1000);
  });
}

export { connectAndSyncDoc, doc };
