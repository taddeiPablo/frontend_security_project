
const severityLabelMap = {
  low: 'Bajo',
  medium: 'Medio',
  high: 'Alto'
};

function renderReport(template, data) {
  let html = template;

  html = html.replace('{{clientName}}', data.clientName || 'Cliente de la agencia');
  html = html.replace('{{siteUrl}}', data.siteUrl);
  html = html.replace('{{score}}', data.score);
  html = html.replace('{{scoreLabel}}', data.scoreLabel);
  html = html.replace('{{scoreLabelClass}}', data.scoreLabelClass);
  html = html.replace('{{reportDate}}', data.reportDate);

  html = html.replace('{{findingsRows}}', renderFindings(data.findings));

  return html;
}

function renderFindings(findings) {

  return findings.map(f => `
    <tr class="severity-${f.severity}">
      <td>${f.severity}</td>
      <td>
        <strong>${f.title}</strong>
        <p>${f.description}</p>
      </td>
      <td>${f.impact}</td>
    </tr>
  `).join('');
}

module.exports = { renderReport };