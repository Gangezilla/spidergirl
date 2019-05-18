/* eslint-disable no-restricted-syntax */
const Tokenizer = require('html-tokenizer');

const normaliseText = text => text.toLowerCase().replace(/[.,/#!?$%^&*;:[\]{}=<>\-_`~()"']/gm, '');

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
  const dirtyText = [];
  const tokens = Tokenizer.tokenize(content);
  for (const token of tokens) {
    const { type, text } = token;
    if (type === 'text') {
      dirtyText.push(text.trim());
    }
  }
  const dirtyTokens = dirtyText
    .filter(Boolean)
    .join(' ')
    .split(' ');
  const normalisedTokens = dirtyTokens.map(token => normaliseText(token));
  return calculateTokenFrequency(normalisedTokens);
};

module.exports = generateTermDocumentFrequency;
