const db = require("../config/db");

const beginCrawling = async () => {
  // try {
  //   db.query(query, values, res => {
  //     console.log(res);
  //   });
  // } catch (err) {
  //   console.log(err.stack);
  // }
};

module.exports = beginCrawling;

// take a URL
// do a request to that URL
// get the HTML of that URL
// put html in DB
// parse the HTML for any anchor tags
// put them into a DB
// go again
