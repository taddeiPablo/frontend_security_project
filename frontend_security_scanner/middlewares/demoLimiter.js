const demoRequests = new Map();

const DEMO_LIMIT = 1; // 1 scan por IP
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 horas

function demoLimiter(req, res, next) {
  const ip = req.ip;
  const now = Date.now();

  const entry = demoRequests.get(ip);

  if (!entry) {
    demoRequests.set(ip, {
      count: 1,
      firstRequest: now
    });
    return next();
  }

  // Reset si pasó la ventana
  if (now - entry.firstRequest > WINDOW_MS) {
    demoRequests.set(ip, {
      count: 1,
      firstRequest: now
    });
    return next();
  }

  if (entry.count >= DEMO_LIMIT) {
    return res.status(429).render('form/index', {
      error: 'Ya utilizaste el escaneo gratuito. Contactanos para acceder a la versión completa.'
    });
  }

  entry.count++;
  next();
}

module.exports = demoLimiter;