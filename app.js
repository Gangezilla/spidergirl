require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const routes = require("./routes");
const logger = require("./config/logger");
const { initPool } = require("./config/db");
const beginCrawling = require("./src/crawler");

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
beginCrawling();
logger.info("App has been initialised.");

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});
