
const severityLabelMap = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto'
};

function renderReport(template, data) {
  let html = template;
  
  html = html.replaceAll('{{agencyLogo}}', data.agencyLogo || '');
  html = html.replaceAll('{{clientName}}', data.clientName || 'Agency client');
  html = html.replaceAll('{{siteUrl}}', data.siteUrl);
  html = html.replaceAll('{{score}}', data.score);
  html = html.replaceAll('{{scoreLabel}}', data.scoreLabel);
  html = html.replaceAll('{{scoreLabelClass}}', data.scoreLabelClass);
  html = html.replaceAll('{{reportDate}}', data.reportDate);
  html = html.replaceAll('{{findingsRows}}', renderFindings(data.findings));
  
  return html;
}

function renderFindings(findings) {
  return findings.map(f => {
    const severity = (f.severity || 'low').toLowerCase();
    return `
      <tr>
        <td class='badge-${severity}'>${severityLabelMap[severity] || 'Bajo'}</td>
        <td>
          <strong>${f.title}</strong>
          <p>${f.description}</p>
        </td>
        <td>${f.impact}</td>
      </tr>
    `;
  }).join('');
}

module.exports = { renderReport };