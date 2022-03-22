const logger = require('./util/logger');
const express = require('express');
const app = express();

require('./Startup/config')();
require('./Startup/loggin')();
require('./Startup/validation')();
require('./Startup/routes')(app);
require('./Startup/db')();
require('./Startup/prod')(app);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
   logger.info(`Listening at port ${port}...`);
});

module.exports = server;
