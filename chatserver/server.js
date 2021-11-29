/**
 * Module dependencies.
 */

require('dotenv').config();
const app = require('./app');
const http = require('http');
const dbconnect = require('./config/database');

const test = require('./test/test');


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

dbconnect();

test();
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
  console.log(`Listening to port ${port}`);
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
