const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function generatePDF(reportHtml) {
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-zygote'
    ]
  });

  const page = await browser.newPage();

  await page.setContent(reportHtml, {
    waitUntil: 'networkidle'
  });

  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '20mm',
      bottom: '20mm',
      left: '15mm',
      right: '15mm'
    }
  });

  await browser.close();
  return pdfBuffer;
}

function loadTemplate() {
  const templatePath = path.join(
    __dirname,
    '../templates/report.html'
  );

  return fs.readFileSync(templatePath, 'utf8');
}

module.exports = {
  generatePDF,
  loadTemplate
};