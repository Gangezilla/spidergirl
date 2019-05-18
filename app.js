require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cron = require("node-cron");

const routes = require("./routes");
const logger = require("./config/logger");
const { initPool } = require("./config/db");
const beginCrawling = require("./src/crawler");
const startIndexer = require('./src/indexer')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("build"));

app.use(helmet());

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(
  bodyParser.json({
    limit: "5mb"
  })
);

app.use("/", routes);

initPool();
cron.schedule("0 * * * *", () => {
  logger.info("Beginning crawling task");
  beginCrawling();
});
logger.info("App has been initialised.");

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
  startIndexer();
});
