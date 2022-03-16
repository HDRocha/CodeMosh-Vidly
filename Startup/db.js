const logger = require("../Startup/logger");
const mongoose = require("mongoose");
const config = require("config");

module.exports = async function () {
  const db = config.get('db');  
  await mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => logger.info(`Connected to ${db}...`));
};
