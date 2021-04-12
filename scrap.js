const cheerio = require('cheerio');
const puppeteer = require('puppeteer');

async function scrap(jobUrl) {
  console.log('Loading the page');

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(jobUrl);
  const bodyHTML = await page.content();
  await page.close();
  await browser.close();
  const selector = cheerio.load(bodyHTML);

  let cities = []
  console.log('Scraping the page');
  const rows = selector('.jquery-tablesorter tbody tr');
  for (let i = 0; i < rows.length; i++) {
    const el = selector(rows[i]);
    const name = el.find('a').html();
    cities.push(name);
  }
  console.log(`${cities.length} cities found`);
  // const image = body.find("#landingImage").attr("src");

  return cities;
}

module.exports.scrap = scrap;