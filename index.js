const express = require('express');
const bodyParser = require('body-parser');
require('dotenv')
  .config();
const config = require('./config');
const app = express();
const server = require('http').createServer(app);
const queue = require('express-queue');

app.use(bodyParser.urlencoded({
  limit: '50mb',
  extended: true
}));
app.use(bodyParser.json({
  limit: '50mb'
}));

app.use('/api/photo/download/:id', queue({ activeLimit: 1, queuedLimit: -1 }));
app.use('/api/photo/thumbnail/:id', queue({ activeLimit: 10, queuedLimit: -1 }));

server.listen(config.server.port, () => {
  console.log('Start Rasp Image Proxy Server at port ' + config.server.port);
  const routes = require('./routes');
  app.use('/', routes);
});

module.exports = app;
