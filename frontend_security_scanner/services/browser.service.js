const { chromium } = require('playwright');

async function loadPage(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.setDefaultNavigationTimeout(20000);
  page.setDefaultTimeout(20000);

  let mainResponse = null;
  const scriptResponses = [];

  page.on('response', async (response) => {
    const req = response.request();

    if (req.resourceType() === 'document' && response.url() === url) {
      mainResponse = response;
    }

    if (req.resourceType() === 'script' &&
        scriptResponses.length < 30) {
          scriptResponses.push({
            url: response.url(),
            headers: response.headers(),
            body: await safeGetBody(response)
          });
    }
  });

  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

  const headers = mainResponse ? mainResponse.headers() : {};

  await browser.close();

  return {
    headers,
    scripts: scriptResponses
  };
}

async function safeGetBody(response) {
  try {
      const text = await response.text();
      if (text.length > 100_000) return '';
      return text;
  } catch {
    return '';
  }
}

module.exports = { loadPage };