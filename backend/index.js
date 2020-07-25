const express = require('express');
const apicache = require('apicache');
const cors = require('cors');
const BioData = require('./Data');

const cache = apicache.middleware;

const PORT = 3030;

const app = express();
app.use(cors());
app.use(cache('1 hour'));  // Setting the cache of 1 hour
// Cache clear delay can be added very easily like (5 minutes, 1 day or 1 hour)

app.get('/', async (req, res) => {
  const data = await BioData.fetchBioData();
  return res.json(data);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});
