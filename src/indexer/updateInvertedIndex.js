const fs = require('fs');
const path = require('path');
const jsonFile = require('jsonfile');

const logger = require('../../config/logger');
// const { readFileAsync } = require('../helpers');

const updateInvertedIndex = async (document) => {
  const { id, termDocumentFrequency } = document;
  try {
    logger.info('Updating inverted index');
    const invertedIndexPath = path.join(`${__dirname}/../../invertedIndex.json`);
    // const invertedIndex = await readFileAsync(invertedIndexPath).toJSON();
    fs.readFile(invertedIndexPath, (err, data) => {
      if (err) throw new Error(err);
      else {
        const invertedIndex = data;
        Object.keys(termDocumentFrequency).reduce((term) => {
          // eslint-disable-next-line no-prototype-builtins
          if (invertedIndex.hasOwnProperty(term)) {
            // update it
            console.log(term, '!!!!!!!!!');
            console.log(invertedIndex[term], id, '********************');
            invertedIndex[term] = {
              docFrequency: invertedIndex[term].docFrequency + termDocumentFrequency[term],
              postings: invertedIndex[term].postings.concat(id),
            };
          } else {
            // create it
            invertedIndex[term] = {
              docFrequency: termDocumentFrequency[term],
              postings: [id],
            };
          }
          return invertedIndex;
        }, invertedIndex);
        jsonFile.writeFile(invertedIndexPath, invertedIndex, {
          spaces: 2,
        });
        logger.info('Completed inverted index');
      }
    });
  } catch (err) {
    logger.error({ message: `Error updating inverted index: ${err}` });
  }
};

module.exports = updateInvertedIndex;

// i imagine when we query we'll get this doc, see which docs we need, then calculate the tf/idf from it.

// go through every term in our docFrequency, see if we can access it.
