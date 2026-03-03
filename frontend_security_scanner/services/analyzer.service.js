const { analyzeSecurityHeaders } = require('../analyzers/headers.analyzer');
const { analyzeJavaScriptExposure } = require('../analyzers/js.analyzer');
const { analyzeSecrets } = require('../analyzers/analyzer.secrets');

function runAnalyzers(data) {
  const findings = [];

  findings.push(...analyzeSecurityHeaders(data.headers));
  findings.push(...analyzeJavaScriptExposure(data.scripts));
  findings.push(...analyzeSecrets(data.scripts));

  return findings;
}

module.exports = { runAnalyzers };