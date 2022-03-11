const logger = require("../Startup/logger");
const mongoose = require("mongoose");

module.exports = async function () {
  await mongoose    
    .connect("mongodb://localhost:27017/vidly", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => logger.info("Connected to MongoDB..."));
};
