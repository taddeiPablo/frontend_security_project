const pdfDownloads = new Map();

const PDF_LIMIT = 1;
const WINDOW_MS = 24 * 60 * 60 * 1000;

function pdfLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  const entry = pdfDownloads.get(ip);

  if (!entry) {
    pdfDownloads.set(ip, {
      count: 1,
      firstDownload: now
    });
    return next();
  }

  if (now - entry.firstDownload > WINDOW_MS) {
    pdfDownloads.set(ip, {
      count: 1,
      firstDownload: now
    });
    return next();
  }

  if (entry.count >= PDF_LIMIT) {
    return res.status(429).render('results/demo', {
      error: 'La descarga gratuita del reporte ya fue utilizada.'
    });
  }

  entry.count++;
  next();
}

module.exports = pdfLimiter;