const { loadPage } = require('../services/browser.service');
const { runAnalyzers } = require('../services/analyzer.service');
const { calculateSecurityScore, getScoreLabel } = require('../services/score.service');
const { loadTemplate, generatePDF } = require('../services/pdf.service');
const { renderReport } = require('../services/reportRenderer.service');

async function scan(req, res) {
  try {
    const { url } = req.body;

    const pageData = await loadPage(url);
    const findings = runAnalyzers(pageData);

    const score = calculateSecurityScore(findings);
    const scoreLabel = getScoreLabel(score);

    const template = loadTemplate();

    const html = renderReport(template, {
      clientName: 'a definir',
      siteUrl: url,
      score,
      scoreLabel,
      reportDate: new Date().toLocaleDateString(),
      findings
    });

    const pdf = await generatePDF(html);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="security-report.pdf"'
    );

    res.send(pdf);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No fue posible generar el reporte'
    });
  }
}

module.exports = { scan };