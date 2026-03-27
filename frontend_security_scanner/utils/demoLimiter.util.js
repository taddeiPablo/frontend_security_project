function limitFindings(findings, limit = 3) {
  if (!Array.isArray(findings)) return [];

  return findings.slice(0, limit);
}

module.exports = { limitFindings };