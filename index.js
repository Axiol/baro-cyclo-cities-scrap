const express = require('express');
const app = express();
const port = 3210;
const scraper = require('./scrap');
const parser = require('./parse');

app.get("/", async (req, res) => {
  const cities = await scraper.scrap(req.query.url);
  const treated = await parser.parse(cities);
  const drawed = await parser.draw(treated[0]);
  const saved = await parser.save(drawed[0]);
  res.send({
    cities,
    nbrCities: cities.length,
    citiesGeo: treated[0],
    nbrCitiesGeo: treated[0].length,
    citiesGeoErr: treated[1],
    citiesDraw: drawed[0],
    nbrCitiesDraw: drawed[0].length,
    citiesDrawErr: drawed[1]
  });
});

app.listen(port, () => {
  console.log(`Call http://localhost:${port} the Wikipedia page URL as 'url' parameter`);
});