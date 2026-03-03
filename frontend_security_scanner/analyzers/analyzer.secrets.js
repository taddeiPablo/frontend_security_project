// analyzer.secrets.js
function analyzeSecrets(scripts) {
  const findings = [];
  
  // Patrones comunes de API Keys y Secretos
  const patterns = {
    FIREBASE_KEY: /AIza[0-9A-Za-z-_]{35}/,
    GENERIC_API_KEY: /(api[_-]?key|auth[_-]?token|secret|password)["']?\s*[:=]\s*["']([0-9a-zA-Z]{16,})["']/gi,
    STRIPE_KEY: /(sk|pk)_(test|live)_[0-9a-zA-Z]{24}/,
    AWS_KEY: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|ASCA|ASIA)[A-Z0-9]{16}/
  };

  scripts.forEach(script => {
    for (const [key, regex] of Object.entries(patterns)) {
      if (regex.test(script.body)) {
        findings.push({
          id: `EXPOSED_${key}`,
          severity: 'high',
          title: `Posible secreto expuesto: ${key}`,
          description: `Se detectó un patrón que coincide con una credencial en el archivo: ${script.url}`,
          impact: 'Un atacante podría usar esta clave para acceder a tus servicios pagos o datos privados.'
        });
      }
    }
  });

  return findings;
}

module.exports = { analyzeSecrets };