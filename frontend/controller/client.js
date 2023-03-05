const Y = require("yjs");
const { WebsocketProvider } = require("y-websocket");
const ws = require("ws");

const doc = new Y.Doc();
const isProduction = process.env.NODE_ENV === "production" || false;
const wsProvider = new WebsocketProvider(
  isProduction ? process.env.NODE_ENV : "ws://localhost:3001",
  isProduction ? process.env.NODE_ENV : "my-roomname",
  doc,
  { WebSocketPolyfill: ws }
);

wsProvider.on("status", (event) => {
  console.log(event.status); // logs "connected" or "disconnected"
});

// test code
function increment() {
  const map = doc.getMap("map");
  const count = map.get("count") || 0;
  map.set("count", count + 1);
  console.log(count);
}

function getValue() {
  const map = doc.getMap("map");
  const count = map.get("count") || 0;
  console.log(count);
}

setInterval(increment, 5000);
setInterval(getValue, 1000);
