function analyzeJavaScriptExposure(scripts) {
  const findingsMap = {};

  scripts.forEach(script => {
    if (script.url.endsWith('.map')) {
      findingsMap['SOURCEMAP_EXPOSED'] = {
        id: 'SOURCEMAP_EXPOSED',
        severity: 'medium',
        title: 'Source map expuesto en producción',
        description: 'Se detectaron archivos source map accesibles públicamente.',
        impact: 'Puede revelar código fuente y lógica interna del frontend.'
      };
    }

    if (script.body.includes('sourceMappingURL=')) {
      findingsMap['SOURCEMAP_REFERENCE'] = {
        id: 'SOURCEMAP_REFERENCE',
        severity: 'low',
        title: 'Referencia a source map en JavaScript',
        description: 'El JavaScript incluye referencias a source maps.',
        impact: 'Puede facilitar ingeniería inversa del código.'
      };
    }

    if (script.body && script.body.split('\n').length > 50) {
      findingsMap['JS_NOT_MINIFIED'] = {
        id: 'JS_NOT_MINIFIED',
        severity: 'low',
        title: 'JavaScript no minificado',
        description: 'Se detectó código JavaScript legible en producción.',
        impact: 'Facilita el análisis del código por terceros.'
      };
    }
  });

  return Object.values(findingsMap);
}

module.exports = { analyzeJavaScriptExposure };