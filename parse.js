const dotenv = require('dotenv');
const axios = require('axios').default;

dotenv.config({
  path: './.env.local'
});

async function parse(cities) {
  let citiesGeo = [];
  let citiesGeoErr = 0;

  for (let i = 0; i < 1; i++) {
    const el = cities[i];

    try {
      const response = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${el}.json?access_token=${process.env.MAPBOX_KEY}&country=BE&types=place`);
      const feature = response.data.features[0];
      citiesGeo.push({
        name: el,
        center: [feature.center[1], feature.center[0]]
      })
    } catch(err) {
      citiesGeoErr++;
    }
  }

  console.log(`${citiesGeo.length} cities located with ${citiesGeoErr} error(s)`);
  
  return [citiesGeo, citiesGeoErr];
}

async function draw(cities) {
  let citiesDraw = [];
  let citiesDrawErr = 0;
  for (let i = 0; i < cities.length; i++) {
    const el = cities[i];
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse.php?lat=${el.center[0]}&lon=${el.center[1]}&zoom=10&polygon_geojson=1&format=jsonv2`);
      const draw = response.data.geojson.coordinates[0];
      citiesDraw.push({
        name: el.name,
        center: el.center,
        borders: draw
      });
    } catch(err) {
      citiesDrawErr++;
    }
  }

  console.log(`${citiesDraw.length} cities drawed with ${citiesDrawErr} error(s)`);

  return [citiesDraw, citiesDrawErr];
}

async function save(cities) {
  let citiesId = [];
  let citiesIdErr = 0;
  for (let i = 0; i < cities.length; i++) {
    const el = cities[i];
    try {
      const response = await axios.post(`${process.env.BACKEND_URL}/places`, {
        name: el.name,
        center: el.center,
        borders: el.borders
      });
    } catch(err) {
      citiesIdErr++;
    }
  }

  return [citiesId, citiesIdErr];
}

module.exports.parse = parse;
module.exports.draw = draw;
module.exports.save = save;