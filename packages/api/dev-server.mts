import http from 'node:http';
import { WebSocketServer as WsWebSocketServer } from 'ws';

import app from './server/http.mjs';
import webSocketServer from './server/ws.mjs';

export { SRCBOOK_DIR } from './constants.mjs';

const server = http.createServer(app);

const wss = new WsWebSocketServer({ server });
wss.on('connection', webSocketServer.onConnection);

const port = process.env.PORT || 2150;
server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

process.on('SIGINT', async function () {
  server.close();
  process.exit();
});
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeFullReload', () => {
    wss.close();
    server.close();
  });

  import.meta.hot.dispose(() => {
    wss.close();
    server.close();
  });
}
