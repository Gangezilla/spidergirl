const nodePath = require('path');
const jsonFile = require('jsonfile');

const db = require('../../config/db');
const logger = require('../../config/logger');
const generateTermDocumentFrequency = require('./generateTermDocumentFrequency');

const getAllEntriesQuery = (itemsPerPage, page) => `SELECT * FROM urls LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage}  `;

const getTotalItemsQuery = 'SELECT COUNT(*) FROM urls';

const startIndexing = async () => {
  try {
    const itemsPerPage = 20;
    logger.info('Beginning indexer');
    // const numberOfEntries = await db
    //   .query(getTotalItemsQuery)
    //   .then(data => data.rows[0].count);
    const numberOfEntries = 1;
    let count = 0;
    let page = 1;
    while (count < numberOfEntries) {
      const query = getAllEntriesQuery(itemsPerPage, page);
      const data = await db.query(query); // eslint-disable-line
      const { rows } = data;
      rows.forEach((row) => {
        const {
          id,
          content,
          scheme,
          queryString,
          path,
          host,
          dateFirstCrawled,
          dateLastCrawled,
        } = row;
        const termDocumentFrequency = generateTermDocumentFrequency(content);
        const newDoc = {
          id,
          content,
          url: `${scheme}://${host}${path}${queryString || ''}`,
          dateCreated: dateFirstCrawled,
          dateUpdated: dateLastCrawled,
          termDocumentFrequency,
        };
        // await updateInvertedIndex(newDoc);
        const filePath = nodePath.join(`${__dirname}/../../documents/${id}.json`);
        // todo, upload this file to s3
        jsonFile.writeFile(filePath, newDoc, {
          spaces: 2,
        });
      });
      page += 1;
      count += itemsPerPage;
    }
    logger.info('Completed indexing');
  } catch (err) {
    logger.error({ message: err });
  }
};

module.exports = startIndexing;

// in the future, check whether the rows on the table have been updated since our last time indexing
// if it has, reindex it, otherwise just leave it for now :)

// later, generate postings list and inverted index from each of these files.
// but yea might be more efficient to do it in one go. but we'll see :)
