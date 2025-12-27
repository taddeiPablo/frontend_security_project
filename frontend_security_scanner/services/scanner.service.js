const axios = require('axios');

async function demoScan(url) {
  const findings = [];

  const response = await axios.get(url, { timeout: 5000 });
  const headers = response.headers;

  // CHECK 1 — CSP
  if (!headers['content-security-policy']) {
    findings.push({
      severity: 'medium',
      title: 'Falta Content Security Policy',
      description: 'El sitio no define una política CSP.',
      impact: 'Mayor riesgo de XSS.'
    });
  }

  // CHECK 2 — X-Frame-Options
  if (!headers['x-frame-options']) {
    findings.push({
      severity: 'low',
      title: 'Falta X-Frame-Options',
      description: 'El sitio puede ser embebido en iframes.',
      impact: 'Riesgo de clickjacking.'
    });
  }

  return {
    findings,
    score: findings.length === 0 ? 90 : 50,
    scoreLabel: findings.length === 0
      ? 'Buen nivel de seguridad'
      : 'Se recomiendan mejoras'
  };
}

module.exports = { demoScan };