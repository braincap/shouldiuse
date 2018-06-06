const keys = require('../../config/keys');
const axios = require('axios');
const _ = require('lodash');

module.exports = async phrases => {
  let resPromises = [];
  Object.values(phrases).forEach((phrase, index) => {
    console.log(keys.nytAPIKeys[index]);
    resPromises.push(
      axios.get(`https://api.nytimes.com/svc/search/v2/articlesearch.json`, {
        params: {
          'api-key': keys.nytAPIKeys[index],
          q: `"+${phrase}+"`,
          fl: 'web_url'
        }
      })
    );
  });

  let resolvedRes;

  try {
    resolvedRes = await Promise.all(resPromises);
  } catch (error) {
    console.log(error);
  }
  const nytHits = resolvedRes.map(res =>
    _.get(res, 'data.response.meta.hits', 0)
  );
  return nytHits;
};
