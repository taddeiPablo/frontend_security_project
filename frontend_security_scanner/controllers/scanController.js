const { loadPage } = require('../services/browser.service');
const { runAnalyzers } = require('../services/analyzer.service');
const { calculateSecurityScore, getScoreLabel, getScoreLabelClass } = require('../services/score.service');
const { loadTemplate, generatePDF } = require('../services/pdf.service');
const { renderReport } = require('../services/reportRenderer.service');
const scannerService = require('../services/scanner.service');
const pdfService = require('../services/pdf.service');
const { limitFindings } = require('../utils/demoLimiter.util');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
const fs = require('fs');
const path = require('path');


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
      clientName: 'to be defined',
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
            error: 'Enter a valid URL'
          });
        }
        
        const result = await scannerService.demoScan(url);
        const demoFindings = limitFindings(result.findings, 3);
        const scoreMeta = getScoreLabel(result.score);
        
        result.scoreLabel = scoreMeta.label;
        result.scoreLabelClass = scoreMeta.className;
        result.hiddenFindingsCount = result.findings.length - demoFindings.length;
        req.session.lastScan = result;
        req.session.lastScan.url = url;

        res.render('results/demo', {
          url,
          findings: demoFindings || [],
          hiddenFindingsCount: result.hiddenFindingsCount,
          score: result.score,
          scoreLabel: scoreMeta.label,
          scoreClass: scoreMeta.className,
          hideDownload: false,
          showBack: false
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
  const logoPath = path.join(__dirname, '../assets/logo_prueba.png');
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  const logoDataUri = `data:image/png;base64,${logoBase64}`;

  if(localStorage.getItem('downloaded')) {
    localStorage.removeItem('downloaded');
    return res.render('results/demo', {
      url: lastResult.url,
      findings: lastResult.findings || [],
      hiddenFindingsCount: lastResult.hiddenFindingsCount,
      score: lastResult.score,
      scoreLabel: lastResult.scoreLabel,
      scoreClass: lastResult.scoreLabelClass,
      error: 'You are only allowed to download the demo report once!!!',
      hideDownload: true,
      showBack: true
    });
  }
  if (!lastResult) {
    return res.redirect('/');
  }
  const demoFindings = limitFindings(lastResult.findings, 3);
  const template = loadTemplate();
  
  const html = renderReport(template, {
    agencyLogo: logoDataUri,
    clientName: 'to be defined',
    siteUrl: lastResult.url,
    score: lastResult.score,
    scoreLabel: lastResult.scoreLabel,
    scoreLabelClass: lastResult.scoreLabelClass,
    reportDate: new Date().toLocaleDateString(),
    findings: demoFindings
  });

  const pdfBuffer = await pdfService.generatePDF(html);
  if (!localStorage.getItem('downloaded')) {
    localStorage.setItem('downloaded', 'true');
  }else{
    localStorage.removeItem('downloaded');
  }

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': 'attachment; filename="security-report-demo.pdf"',
    'Content-Length': pdfBuffer.length
  });

  res.send(pdfBuffer);
};

module.exports = { scan, demoScan, downloadDemoPdf };