const axios = require('axios');
const _ = require('lodash');

module.exports = async phrases => {
  let resPromises = [];

  Object.values(phrases).forEach(phrase => {
    resPromises.push(
      axios.get(
        `https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch="+${phrase}+"&srwhat=text&srinfo=totalhits`
      )
    );
  });

  let resolvedRes;

  try {
    resolvedRes = await Promise.all(resPromises);
  } catch (error) {
    console.log(error);
  }

  const wikiHits = resolvedRes.map(res =>
    _.get(res, 'data.query.searchinfo.totalhits', 0)
  );
  return wikiHits;
};
