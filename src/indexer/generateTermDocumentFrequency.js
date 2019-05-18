const { stemmer } = require('porter-port');

const normaliseText = text => text.toLowerCase().replace(/[.,/#!?$%^&*;:[\]{}=<>\-_`~()"']/gm, '');

const tokeniseText = text => text.split(' ');

const calculateTokenFrequency = (tokens) => {
  const unsortedTokens = tokens.reduce((count, word) => {
    count[word] = (count[word] || 0) + 1; // eslint-disable-line
    return count;
  }, {});

  const sortedTokens = {};
  Object.keys(unsortedTokens)
    .sort()
    .forEach(key => (sortedTokens[key] = unsortedTokens[key])); // eslint-disable-line
  return sortedTokens;
};

const generateTermDocumentFrequency = (content) => {
  // i get the feeling this won't work as well for HTML, so probably have to come back.
  // yeah, the index it generates looks pretty fucked up. defs have to revisit.
  const normalisedContent = normaliseText(content);
  const tokenisedContent = tokeniseText(normalisedContent);
  const stemmedContent = tokenisedContent.map(word => stemmer(word));
  const termDocFrequency = calculateTokenFrequency(stemmedContent);
  return termDocFrequency;
};

module.exports = generateTermDocumentFrequency;
