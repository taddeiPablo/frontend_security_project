const { chromium } = require('playwright');

async function loadPage(url) {
 // 1. Lanzamos el browser
  const browser = await chromium.launch({ headless: true });
  
  try {
    const page = await browser.newPage();

    // Timeouts preventivos (20s es un buen balance)
    page.setDefaultNavigationTimeout(20000);
    page.setDefaultTimeout(20000);

    let mainResponse = null;
    const scriptResponses = [];

    // 2. Listener de respuestas
    page.on('response', async (response) => {
      const req = response.request();
      const status = response.status();

      // Capturamos el documento principal (manejando redirecciones 3xx)
      if (req.resourceType() === 'document' && (status >= 200 && status < 400)) {
        mainResponse = response;
      }

      // Capturamos scripts (límite de 30 para no saturar memoria)
      if (req.resourceType() === 'script' && scriptResponses.length < 30) {
        try {
          const body = await safeGetBody(response);
          scriptResponses.push({
            url: response.url(),
            headers: response.headers(),
            body: body
          });
        } catch (e) {
          // Si un script falla (ej. 404), simplemente lo ignoramos y seguimos
          console.error(`Error capturando script: ${response.url()}`);
        }
      }
    });

    // 3. Navegación
    // 'networkidle' es más seguro que 'domcontentloaded' para capturar scripts asíncronos
    await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });

    const headers = mainResponse ? mainResponse.headers() : {};

    return {
      headers,
      scripts: scriptResponses
    };

  } catch (error) {
    console.error(`Error en loadPage para ${url}:`, error.message);
    throw error; // Re-lanzamos para que el controller lo capture y avise al usuario
  } finally {
    // 4. EL PASO MÁS IMPORTANTE
    // Pase lo que pase (éxito o error), cerramos el proceso de Chromium
    await browser.close();
  }
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