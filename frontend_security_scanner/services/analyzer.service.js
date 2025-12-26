const { analyzeSecurityHeaders } = require('../analyzers/headers.analyzer');
const { analyzeJavaScriptExposure } = require('../analyzers/js.analyzer');

function runAnalyzers(data) {
  const findings = [];

  findings.push(...analyzeSecurityHeaders(data.headers));
  findings.push(...analyzeJavaScriptExposure(data.scripts));

  return findings;
}

module.exports = { runAnalyzers };