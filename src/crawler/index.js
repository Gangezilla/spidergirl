const fetch = require('node-fetch');
const cheerio = require('cheerio');
const parseUri = require('./parseUri');

const db = require('../../config/db');
const logger = require('../../config/logger');

const newUrlQuery = 'INSERT INTO urls(path, host, scheme, "queryString") VALUES($1, $2, $3, $4) RETURNING *';
const generateValuesForNewUrl = (path, host, scheme, queryString) => [
  path,
  host,
  scheme,
  queryString,
];

const getUncrawledUrls = 'SELECT * FROM urls WHERE "dateLastCrawled" IS NULL';
const generateCompleteUrlFromRow = row => `${row.scheme}://${row.host}${row.path}${row.queryString}`;

const updateUrl = 'UPDATE urls SET content=($1), "dateLastCrawled"=($2) WHERE id=($3)';
const generateValuesForUpdateUrl = (content, id) => [content, new Date().toISOString(), id];

const getNewLinksFromContent = (resolvedLink, content) => {
  const $ = cheerio.load(content);
  const links = [];
  $('a').map((i, link) => {
    let href = $(link).attr('href');
    if (href) {
      if (!href.includes('http')) {
        const { protocol, host } = parseUri(resolvedLink);
        href = `${protocol}://${host}${href}`;
      }
      links.push(href);
    }
  });
  return links;
};

const beginCrawling = async () => {
  const res = await db.query(getUncrawledUrls);
  const links = res.rows.map(row => ({
    url: generateCompleteUrlFromRow(row),
    id: row.id,
  }));
  links.forEach(async (link) => {
    try {
      const resp = await fetch(link.url);
      const text = await resp.text();
      const content = text.replace(/\r?\n|\r/g, '');
      const updateValues = generateValuesForUpdateUrl(content, link.id);
      const updateRes = await db.query(updateUrl, updateValues);

      const newLinks = getNewLinksFromContent(link.url, content);
      newLinks.forEach(async (newLink) => {
        const {
          path, host, protocol, query,
        } = parseUri(newLink);
        const newUrlValues = generateValuesForNewUrl(path, host, protocol, query);
        const newRes = await db.query(newUrlQuery, newUrlValues);
      });
    } catch (err) {
      logger.error({ message: err });
      // do something clever here when you get around to it;
    }
  });
};

module.exports = beginCrawling;
