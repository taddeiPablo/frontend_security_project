function calculateSecurityScore(findings) {
  let score = 100;

  findings.forEach(finding => {
    switch (finding.severity) {
      case 'high':
        score -= 30;
        break;
      case 'medium':
        score -= 15;
        break;
      case 'low':
        score -= 5;
        break;
      default:
        break;
    }
  });

  return Math.max(score, 0);
}

function getScoreLabel(score) {
  if (score >= 85) return 'Bueno';
  if (score >= 65) return 'Aceptable';
  return 'Se recomienda aplicar mejoras';
}

module.exports = {
  calculateSecurityScore,
  getScoreLabel
};