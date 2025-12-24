const { chromium } = require('playwright');

async function loadPage(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  let mainResponse = null;

  page.on('response', (response) => {
    if (response.url() === url && response.request().resourceType() === 'document') {
      mainResponse = response;
    }
  });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

  const headers = mainResponse ? mainResponse.headers() : {};

  await browser.close();

  return { headers };
}

module.exports = { loadPage };