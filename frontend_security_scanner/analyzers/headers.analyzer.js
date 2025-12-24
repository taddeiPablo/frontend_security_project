function analyzeSecurityHeaders(headers) {
  const findings = [];

  if (!headers['content-security-policy']) {
    findings.push({
      id: 'CSP_MISSING',
      severity: 'medium',
      title: 'Falta Content Security Policy',
      description: 'El sitio no define una política CSP.',
      impact: 'Mayor riesgo de ataques XSS e inyección de scripts.'
    });
  }

  if (!headers['x-frame-options']) {
    findings.push({
      id: 'XFO_MISSING',
      severity: 'low',
      title: 'Falta X-Frame-Options',
      description: 'El sitio puede ser embebido en iframes externos.',
      impact: 'Posible vulnerabilidad a clickjacking.'
    });
  }

  if (!headers['strict-transport-security']) {
    findings.push({
      id: 'HSTS_MISSING',
      severity: 'medium',
      title: 'Falta HTTP Strict Transport Security (HSTS)',
      description: 'El sitio no fuerza HTTPS.',
      impact: 'Riesgo de ataques Man-in-the-Middle.'
    });
  }

  return findings;
}

module.exports = { analyzeSecurityHeaders };