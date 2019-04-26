const fetch = require("node-fetch");
const cheerio = require("cheerio");

const db = require("../config/db");
const query =
  'INSERT INTO urls(path, host, scheme, content, "dateLastCrawled", "queryString") VALUES($1, $2, $3, $4, $5, $6) RETURNING *';
const generateValues = (path, host, scheme, content, queryString) => {
  [path, host, scheme, content, new Date().toISOString(), queryString];
};

const beginCrawling = async () => {
  const resp = await fetch("http://dmoz-odp.org/");
  const text = await resp.text();
  const cleanText = text.replace(/\s/g, "");

  // const query =
  //   "UPDATE urls SET content=($1), dateLastCrawled=($2) WHERE id=2";
  // const values = [text, Date.now()];
  // console.log(text, "!!!!!!!!!!!");
  // const values = generateValues();
  const response = await db.query(query, values);
  // console.log(response);
  // console.log(text);
  $ = cheerio.load(text);
  $("a").each((i, link) => {
    // console.log($(link).text(), "text");
    // console.log($(link).attr("href"), "link!");
  });

  // do a fetch to reddit...
  //...
  // insert into id = 1
};

module.exports = beginCrawling;

// take a URL
// do a request to that URL
// get the HTML of that URL
// put html in DB
// parse the HTML for any anchor tags
// put them into a DB
// go again
