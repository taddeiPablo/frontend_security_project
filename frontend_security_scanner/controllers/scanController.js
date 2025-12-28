const { loadPage } = require('../services/browser.service');
const { runAnalyzers } = require('../services/analyzer.service');
const { calculateSecurityScore, getScoreLabel, getScoreLabelClass } = require('../services/score.service');
const { loadTemplate, generatePDF } = require('../services/pdf.service');
const { renderReport } = require('../services/reportRenderer.service');
const scannerService = require('../services/scanner.service');
const pdfService = require('../services/pdf.service');
const { limitFindings } = require('../utils/demoLimiter.util');

async function scan(req, res, next) {
  try {
    const { url } = req.body;

    const pageData = await loadPage(url);
    const findings = runAnalyzers(pageData);

    const score = calculateSecurityScore(findings);
    const scoreLabel = getScoreLabel(score);
    const scoreLabelClass = getScoreLabelClass(score);

    const template = loadTemplate();

    const html = renderReport(template, {
      clientName: 'a definir',
      siteUrl: url,
      score,
      scoreLabel,
      scoreLabelClass,
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
};

async function demoScan(req, res, next) {
    try {
        const { url } = req.body;

        if (!url) {
          return res.render('form/index', {
            error: 'Ingresá una URL válida'
          });
        }
        
        const result = await scannerService.demoScan(url);
        const demoFindings = limitFindings(result.findings, 3);
        const scoreMeta = getScoreLabel(result.score);

        req.session.lastScan = result;
        res.render('results/demo', {
          url,
          findings: demoFindings,
          hiddenFindingsCount: result.findings.length - demoFindings.length,
          score: result.score,
          scoreLabel: scoreMeta.label,
          scoreClass: scoreMeta.className
        });    
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: 'No fue posible generar el reporte'
      });    
    }
};

async function downloadDemoPdf(req, res) {
  const lastResult = req.session?.lastScan;

  if (!lastResult) {
    return res.redirect('/');
  }
  const demoFindings = limitFindings(lastResult.findings, 3);
  const template = loadTemplate();

  const html = renderReport(template, {
    clientName: 'a definir',
    siteUrl: lastResult.url,
    score: lastResult.score,
    scoreLabel: lastResult.scoreLabel,
    scoreLabelClass: lastResult.scoreLabelClass,
    reportDate: new Date().toLocaleDateString(),
    findings: demoFindings
  });

  const pdfBuffer = await pdfService.generatePDF(html);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="security-report-demo.pdf"',
    'Content-Length': pdfBuffer.length
  });

  res.send(pdfBuffer);
};

module.exports = { scan, demoScan, downloadDemoPdf };