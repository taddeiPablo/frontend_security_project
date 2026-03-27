const { loadPage } = require('../services/browser.service');
const { runAnalyzers } = require('../services/analyzer.service');
const { calculateSecurityScore, getScoreLabel } = require('../services/score.service');
const {demo_Scan, calculateScore } = require('../services/scanner.service');
const { limitFindings } = require('../utils/demoLimiter.util');
const remediationData = require('../utils/remediationData');
const { insertScan, deleteScan, showScan } = require('../lib/supabaseActions');

async function scan(req, res, next) {
  try {
    const { url } = req.body;
    const {user, profile} = req.cookies.cookieDataInfo ? JSON.parse(req.cookies.cookieDataInfo) : {user: null, profile: {full_name: 'Empresa'}};
    res.locals.user = user;
    res.locals.profile = profile;
    result = {};

    if(profile.plan_type !== 'free'){
        // ejecucion de funciones para escaneo
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
        result.url = url || '';
        result.companyName = profile.full_name || 'Empresa';
        result.findings = findingsWithRemediation;
        result.score = score;   
        result.scoreLabel = scoreMeta.label;
        result.scoreLabelClass = scoreMeta.className;
        result.hiddenFindingsCount = result.findings.length - findingsWithRemediation.length;
        console.log(result);
      }else{
        // Lógica para escaneo free
        const pageData = await loadPage(url);
        const rawFindings = await runAnalyzers(pageData, url);
        const demoFindings = limitFindings(rawFindings, 3);
        const scoreMeta = getScoreLabel(rawFindings.score);
        result.url = url || '';
        result.companyName = profile.full_name || 'Empresa';
        result.findings = demoFindings;
        result.score = calculateScore(rawFindings);
        result.scoreLabel = scoreMeta.label;
        result.scoreLabelClass = scoreMeta.className;
        result.hiddenFindingsCount = result.findings.length - demoFindings.length;
        console.log(result);
    }
    req.session.lastScan = result;
    req.session.lastScan.url = url;
    
    await insertScan(user.id, url, result.score, result.findings);
    
    res.render('results/premium', {
      companyName: result.companyName,
      url: result.url,
      findings: result.findings || [],
      hiddenFindingsCount: result.hiddenFindingsCount,
      score: result.score,
      scoreLabel: result.scoreLabel,//scoreMeta.label,
      scoreClass: result.scoreLabelClass,//scoreMeta.className,
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
        
        const result = await demo_Scan(url);
        const demoFindings = limitFindings(result.findings, 2);
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
async function delete_Scan(req, res, next) {
    try {
        const scanId = req.params.id;
        const { user } = req.cookies.cookieDataInfo ? JSON.parse(req.cookies.cookieDataInfo) : {user: null, profile: {full_name: 'Empresa'}};
        const user_id = user ? user.id : null;
        const result_delete = await deleteScan(scanId, user_id);
        res.status(200).json({
          result: result_delete
        });    
    } catch (error) {
        console.error(error);
        res.status(500).json({
          error: 'No fue posible eliminar el escaneo'
        });
    }
};
async function show_Scan(req, res, next) {
  try {
    const scanId = req.params.id;
    const { user, profile } = req.cookies.cookieDataInfo ? JSON.parse(req.cookies.cookieDataInfo) : {user: null, profile: {full_name: 'Empresa'}};
    const user_id = user ? user.id : null;
    res.locals.user = user;
    res.locals.profile = profile;
    const scanData = await showScan(scanId, user_id);
    result = {};
    result.url = scanData.url || '';
    result.findings = scanData.findings || [];
    result.score = scanData.score || 0;   
    result.scoreLabel = getScoreLabel(result.score).label;
    result.scoreLabelClass = getScoreLabel(result.score).className;
    result.hiddenFindingsCount = result.findings.length - result.findings.length;
    req.session.lastScan = result;
    req.session.lastScan.url = result.url;
    
    res.render('results/premium' , { 
      companyName: profile.full_name,
      url: scanData.url,
      findings: result.findings || [],
      hiddenFindingsCount: result.hiddenFindingsCount,
      score: result.score,
      scoreLabel: result.scoreLabel, // aqui aplicar cambio
      scoreClass: result.scoreLabelClass, // aqui aplicar cambio
      hideDownload: false,
      showBack: false
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'No fue posible obtener el escaneo'
    });
  }
}



module.exports = { scan, demoScan, renderDemoReport, renderPremiumReport, delete_Scan, show_Scan };