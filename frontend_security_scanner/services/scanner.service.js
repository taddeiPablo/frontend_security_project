const axios = require('axios');

async function demoScan(url) {
  const findings = [];

  let response;

  try {
    response = await axios.get(url, {
      timeout: 5000,
      maxRedirects: 5,
      validateStatus: () => true
    });
  } catch (err) {
    return {
      findings: [],
      score: 0,
      scoreLabel: 'Scan failed',
      error: 'Unable to reach the target URL'
    };
  }

  const headers = response.headers || {};

  // CHECK 1 — Content Security Policy
  if (!headers['content-security-policy']) {
    findings.push({
      id: 'CSP_MISSING',
      severity: 'medium',
      title: 'Missing Content Security Policy (CSP)',
      description: 'The site does not define a Content Security Policy.',
      impact: 'Increases the risk of XSS and malicious script injection.'
    });
  }

  // CHECK 2 — X-Frame-Options
  if (!headers['x-frame-options']) {
    findings.push({
      id: 'XFO_MISSING',
      severity: 'low',
      title: 'Missing X-Frame-Options header',
      description: 'The site can be embedded in external iframes.',
      impact: 'Potential risk of clickjacking attacks.'
    });
  }

  // CHECK 3 — Strict-Transport-Security (HSTS)
  if (!headers['strict-transport-security']) {
    findings.push({
      id: 'HSTS_MISSING',
      severity: 'medium',
      title: 'Missing HTTP Strict Transport Security (HSTS)',
      description: 'The site does not enforce HTTPS connections.',
      impact: 'Users may be exposed to man-in-the-middle attacks.'
    });
  }

  // CHECK 4 — X-Content-Type-Options
  if (!headers['x-content-type-options']) {
    findings.push({
      id: 'XCTO_MISSING',
      severity: 'low',
      title: 'Missing X-Content-Type-Options header',
      description: 'The browser may attempt MIME type sniffing.',
      impact: 'Could lead to execution of malicious content.'
    });
  }

  // CHECK 5 — Referrer-Policy
  if (!headers['referrer-policy']) {
    findings.push({
      id: 'REFERRER_POLICY_MISSING',
      severity: 'low',
      title: 'Missing Referrer-Policy header',
      description: 'The site does not control referrer information.',
      impact: 'Sensitive URLs may be leaked to third parties.'
    });
  }

  // CHECK 6 — Cookies without Secure / SameSite
  const setCookie = headers['set-cookie'];
  if (Array.isArray(setCookie)) {
    setCookie.forEach(cookie => {
      if (!cookie.toLowerCase().includes('secure')) {
        findings.push({
          id: 'COOKIE_INSECURE',
          severity: 'low',
          title: 'Cookie without Secure flag',
          description: 'A cookie was detected without the Secure attribute.',
          impact: 'Cookie may be transmitted over unencrypted connections.'
        });
      }

      if (!cookie.toLowerCase().includes('samesite')) {
        findings.push({
          id: 'COOKIE_SAMESITE_MISSING',
          severity: 'low',
          title: 'Cookie without SameSite attribute',
          description: 'A cookie does not define a SameSite policy.',
          impact: 'Increased risk of CSRF attacks.'
        });
      }
    });
  }

  // SCORE (simple y estable)
  const score = calculateScore(findings);

  return {
    findings,
    score,
    scoreLabel: score >= 80
      ? 'Good level of security'
      : score >= 50
        ? 'Improvements are recommended'
        : 'High security risk detected'
  };
}

function calculateScore(findings) {
  let score = 100;

  findings.forEach(f => {
    if (f.severity === 'high') score -= 20;
    if (f.severity === 'medium') score -= 10;
    if (f.severity === 'low') score -= 5;
  });

  return Math.max(score, 20);
}

module.exports = { demoScan };