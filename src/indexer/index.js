const nodePath = require("path");
const jsonFile = require("jsonfile");

const db = require("../../config/db");
const logger = require("../../config/logger");

const getAllEntriesQuery = (itemsPerPage, page) =>
  `SELECT * FROM urls LIMIT ${itemsPerPage} OFFSET ${(page - 1) *
    itemsPerPage}  `;

const startIndexing = async () => {
  try {
    console.log("indexing now!");
    const query = getAllEntriesQuery(20, 1);
    const data = await db.query(query);
    const rows = data.rows;
    console.log(rows.length);
    rows.forEach(row => {
      // generate a JSON object according to the schema
      // write it to a doc
      const {
        id,
        content,
        scheme,
        queryString,
        path,
        host,
        dateFirstCrawled,
        dateLastCrawled
      } = row;
      const newDoc = {
        id: id,
        content: content,
        url: `${scheme}://${host}${path}${queryString ? queryString : ""}`,
        dateCreated: dateFirstCrawled,
        dateUpdated: dateLastCrawled
      };
      const filePath = nodePath.join(__dirname + `/../../documents/${id}.json`);
      console.log(filePath, "******");
      jsonFile.writeFile(filePath, newDoc, {
        spaces: 2
      });
    });
  } catch (err) {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!", err);
    logger.error(err);
  }
};

module.exports = startIndexing;

// Convert it from an object to string with stringify

// var json = JSON.stringify(obj);
// use fs to write the file to disk

// var fs = require('fs');
// fs.writeFile('myjsonfile.json', json, 'utf8', callback);
// define our schema
// then we'll go through each row on the table and create a file according to the schema.

// in the future, we'd need to check whether the rows on the table have been updated since our last time indexing
// if it has, reindex it, otherwise just leave it for now :)

// later, generate postings list and inverted index from each of these files.
// but yea might be more efficient to do it in one go. but we'll see :)

// hectic slow getting all. maybe we want to only get x at a time.
