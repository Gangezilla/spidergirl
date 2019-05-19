const fs = require('fs');
const path = require('path');
const jsonFile = require('jsonfile');

const logger = require('../../config/logger');
const { readFileAsync } = require('../helpers');

const updateInvertedIndex = async (document) => {
  const { id, termDocumentFrequency } = document;
  try {
    logger.info('Updating inverted index');
    const invertedIndexPath = path.join(`${__dirname}/../../invertedIndex.json`);
    const invertedIndex = await readFileAsync(invertedIndexPath);
    Object.keys(termDocumentFrequency).forEach((term) => {
      // eslint-disable-next-line no-prototype-builtins
      if (invertedIndex.hasOwnProperty(term)) {
        // update it
        console.log(invertedIndex[term], id, '********************');
        invertedIndex[term] = {
          docFrequency: invertedIndex[term].doc_freq + termDocumentFrequency[term],
          postings: invertedIndex[term].postings.concat(id),
        };
      } else {
        // create it
        invertedIndex[term] = {
          docFrequency: termDocumentFrequency[term],
          postings: id,
        };
      }
    });
    jsonFile.writeFile(invertedIndexPath, invertedIndex, {
      spaces: 2,
    });
    // in future, replace the above with getting the index from s3
  } catch (err) {
    logger.error({ message: `Error updating inverted index: ${err}` });
  }
};

module.exports = updateInvertedIndex;

// pass 1.
// save index to disk.
// get index

// index has docFrequency (frequency across entire corpus)
// and postings_list (which docs it occurs in)
// go through each of the terms,
//     check does it exist in the index? if it does, update it
// if not, create a new entry, and update it

// i imagine when we query we'll get this doc, see which docs we need, then calculate the tf/idf from it.

// go through every term in our docFrequency, see if we can access it.
