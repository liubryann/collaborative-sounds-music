import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import * as Sentry from "@sentry/nextjs";

let wsProvider: WebsocketProvider;
let doc: Y.Doc = new Y.Doc();
const url: string = process.env.NEXT_PUBLIC_API_DOMAIN
  ? "wss://" + process.env.NEXT_PUBLIC_API_DOMAIN + "/ws"
  : "ws://localhost:3001";

/**
 * Connects to the websocket server and syncs the document.
 */
function connectAndSyncDoc(room: string): Promise<any> {
  return new Promise<any>((resolve, reject) => {
    doc = new Y.Doc();
    wsProvider = new WebsocketProvider(url, room, doc);
    const awareness = wsProvider.awareness;

    wsProvider.on("status", (event: { status: any }) => {
      Sentry.captureMessage(event.status);
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
