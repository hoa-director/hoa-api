import 'dotenv/config';
import * as http from 'http';
import { connection } from './config/database.js';

import app from './app.js';
import exp from 'constants';

const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
server.on('listening', onListening);

function normalizePort(val: number | string): number | string | false {
  const parsedPort: number = typeof val === 'string' ? parseInt(val, 10) : val;
  if (isNaN(parsedPort)) {
    return val;
  } else if (parsedPort >= 0) {
    return parsedPort;
  } else {
    return false;
  }
}

function onListening(): void {
  console.log(`listening on port ${port}`);
  console.log(process.env.NODE_ENV)
}
