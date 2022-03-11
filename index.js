const logger = require("./Startup/logger");
const express = require("express");
const app = express();

require("./Startup/config")();
require("./Startup/loggin")();
require("./Startup/validation")();
require("./Startup/routes")(app);
require("./Startup/db")();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Listening at port ${port}...`);
});
