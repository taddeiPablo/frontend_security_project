const { loadPage } = require('../services/browser.service');
const { runAnalyzers } = require('../services/analyzer.service');
const { calculateSecurityScore, getScoreLabel } = require('../services/score.service');

async function scan(req, res, next){
    try {
        const { url } = req.body;

        if (!url) {
        return res.status(400).json({ error: 'URL requerida' });
        }

        const pageData = await loadPage(url);
        const findings = runAnalyzers(pageData);

        const score = calculateSecurityScore(findings);
        const scoreLabel = getScoreLabel(score);

        res.json({
            url,
            score,
            scoreLabel,
            findingsCount: findings.length,
            findings
        }); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error durante el escaneo' });
    }
};

module.exports = { scan };