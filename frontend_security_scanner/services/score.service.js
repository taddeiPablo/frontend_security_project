function calculateSecurityScore(findings) {
  let penalty = 0;

  findings.forEach(finding => {
    switch (finding.severity) {
      case 'high':
        penalty += 30;
        break;
      case 'medium':
        penalty += 15;
        break;
      case 'low':
        penalty += 5;
        break;
    }
  });

  const MAX_PENALTY = 70;
  const finalPenalty = Math.min(penalty, MAX_PENALTY);

  const score = 100 - finalPenalty;
  return Math.max(score, 0);
}

function getScoreLabel(score) {
  if (score >= 85) return 'Bueno';
  if (score >= 65) return 'Aceptable';
  return 'Se recomienda aplicar mejoras';
}

function getScoreLabelClass(score) {
  if (score >= 80) return 'good';
  if (score >= 50) return 'warning';
  return 'bad';
}

function normalizeSeverity(severity) {
  const s = severity.toLowerCase();
  if (s === 'critical' || s === 'high') return 'high';
  if (s === 'medium' || s === 'warn') return 'medium';
  return 'low';
}

module.exports = {
  calculateSecurityScore,
  getScoreLabel,
  getScoreLabelClass,
  normalizeSeverity
};