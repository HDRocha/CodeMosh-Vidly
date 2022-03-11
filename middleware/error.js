const winston = require("winston");
require("winston-mongodb");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

logger.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost:27017/vidly",
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
);

module.exports = function (err, req, res, next) {
  //log the exceptions
  logger.error(err.message, err);

  res.status(500).send("Something failed.");
};
