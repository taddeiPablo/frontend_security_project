// ... importaciones ...
const { analyzeSecurityHeaders } = require('../analyzers/headers.analyzer');
const { analyzeJavaScriptExposure } = require('../analyzers/js.analyzer');
const { analyzeSecrets } = require('../analyzers/analyzer.secrets');
const { analyzeExposedFiles } = require('../analyzers/analyzeExposedFiles');

async function runAnalyzers(data, url) {
  const findings = [];

  findings.push(...analyzeSecurityHeaders(data.headers));
  findings.push(...analyzeJavaScriptExposure(data.scripts));
  findings.push(...analyzeSecrets(data.scripts));
  const infraFindings = await analyzeExposedFiles(url); // Este requiere esperar a la red (Asíncrono)
  findings.push(...infraFindings);

  return findings;
}

module.exports = { runAnalyzers };