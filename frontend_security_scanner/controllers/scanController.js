const { loadPage } = require('../services/browser.service');
const { runAnalyzers } = require('../services/analyzer.service');
const { calculateSecurityScore, getScoreLabel } = require('../services/score.service');
const scannerService = require('../services/scanner.service');
const { limitFindings } = require('../utils/demoLimiter.util');
const remediationData = require('../utils/remediationData');
const { insertScan } = require('../lib/supabaseCrud');

async function scan(req, res, next) {
  try {
    const { url } = req.body;
    const {user, profile} = req.cookies.cookieDataInfo ? JSON.parse(req.cookies.cookieDataInfo) : {user: null, profile: {full_name: 'Empresa'}};
    res.locals.user = user;
    res.locals.profile = profile;
    const pageData = await loadPage(url);
    const rawFindings = await runAnalyzers(pageData, url);

    const findingsWithRemediation = rawFindings.map(f => {
        return {
            ...f,
            remediation: remediationData[f.id] || null 
        };
    });

    const score = calculateSecurityScore(findingsWithRemediation);
    const scoreMeta = getScoreLabel(score);

    result = {};
    result.findings = findingsWithRemediation;
    result.score = score;   
    result.scoreLabel = scoreMeta.label;
    result.scoreLabelClass = scoreMeta.className;
    result.hiddenFindingsCount = result.findings.length - findingsWithRemediation.length;
    req.session.lastScan = result;
    req.session.lastScan.url = url;
    
    await insertScan(user.id, url, score, result.findings);
    
    res.render('results/premium', {
      companyName: profile.full_name,
      url,
      findings: findingsWithRemediation || [],
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
async function demoScan(req, res) {
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
        error: 'Unable to generate the report'
      });    
    }
};
async function renderDemoReport(req, res) {
  const lastResult = req.session.lastScan;
  
  if (!lastResult) {
    return res.redirect('/');
  }
  
  const reportDateNow = new Date().toLocaleDateString();
  res.render('results/report', {
    url: lastResult.url,
    findings: limitFindings(lastResult.findings || [], 3),
    hiddenFindingsCount: lastResult.hiddenFindingsCount,
    score: lastResult.score,
    scoreLabel: lastResult.scoreLabel,
    scoreClass: lastResult.scoreLabelClass,
    error: 'You are only allowed to download the demo report once.',
    hideDownload: true,
    showBack: true,
    reportDate: reportDateNow
  });
};
async function renderPremiumReport(req, res) {
  const lastResult = req.session.lastScan;
  const { profile } = req.cookies.cookieDataInfo ? JSON.parse(req.cookies.cookieDataInfo) : {user: null, profile: {full_name: 'Empresa'}};

  if (!lastResult) {
    return res.redirect('/');
  }  
  const reportDateNow = new Date().toLocaleDateString();
  const profile_companyName = profile.full_name || 'Empresa';
  
  res.render('results/report', {
    companyName: profile_companyName,
    url: lastResult.url,
    findings: limitFindings(lastResult.findings || [], 3),
    hiddenFindingsCount: lastResult.hiddenFindingsCount,
    score: lastResult.score,
    scoreLabel: lastResult.scoreLabel,
    scoreClass: lastResult.scoreLabelClass,
    error: 'You are only allowed to download the demo report once.',
    hideDownload: true,
    showBack: true,
    reportDate: reportDateNow
  });
};

module.exports = { scan, demoScan, renderDemoReport, renderPremiumReport };