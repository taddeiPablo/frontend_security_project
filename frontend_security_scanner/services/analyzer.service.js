const { analyzeSecurityHeaders } = require('../analyzers/headers.analyzer');

function runAnalyzers(data) {
  const findings = [];

  findings.push(...analyzeSecurityHeaders(data.headers));

  return findings;
}

module.exports = { runAnalyzers };