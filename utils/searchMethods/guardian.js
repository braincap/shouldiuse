const keys = require('../../config/keys');
const axios = require('axios');
const _ = require('lodash');

module.exports = async phrases => {
  let resPromises = [];
  Object.values(phrases).forEach((phrase, index) => {
    resPromises.push(
      axios.get(
        `https://content.guardianapis.com/search?q="+${phrase}+"&api-key=${
          keys.guardianAPIKey
        }`
      )
    );
  });

  let resolvedRes;

  try {
    resolvedRes = await Promise.all(resPromises);
  } catch (error) {
    console.log(error);
  }
  const guardianHits = resolvedRes.map(res =>
    _.get(res, 'data.response.total', 0)
  );
  return guardianHits;
};
