const express = require('express');
const axios = require('axios');
const keys = require('./config/keys');
const app = express();

// https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&utf8=1&srsearch=india&srwhat=text&srinfo=totalhits

app.get('/api/search_phrases', async (req, res) => {
  const phrases = req.query;
  const wikiHits = await require('./utils/searchMethods/wiki')(phrases);
  const nytHits = await require('./utils/searchMethods/nyt')(phrases);
  const guardianHits = await require('./utils/searchMethods/guardian')(phrases);
  const finalResults = {};
  for (let i = 0; i < Object.keys(phrases).length; i++) {
    finalResults[Object.keys(phrases)[i]] = {};
    finalResults[Object.keys(phrases)[i]]['wikipedia'] = wikiHits[i];
    finalResults[Object.keys(phrases)[i]]['nyt'] = nytHits[i];
    finalResults[Object.keys(phrases)[i]]['guardian'] = guardianHits[i];
  }
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

app.listen(process.env.PORT || 5000, () =>
  console.log(`Listening to port ${process.env.PORT || 5000}`)
);
