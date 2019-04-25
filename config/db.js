const { Pool } = require("pg");
const logger = require("./logger");

let pool;

const initPool = () => {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL
  });
};

const closePool = () => {
  logger.info("The pool is now closed, ladies and gentlemen.");
  pool.end();
};

const query = (queryText, params, callback) => {
  const start = Date.now();
  return pool.query(queryText, params, (err, res) => {
    const duration = Date.now() - start;
    logger.info("executed query", queryText, "duration:", duration);
    callback(err, res);
  });
};

module.exports = {
  query,
  initPool,
  closePool
};
