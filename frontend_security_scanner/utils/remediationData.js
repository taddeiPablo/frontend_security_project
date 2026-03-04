const remediationData = {
  'CSP_MISSING': {
    title: 'Configurar Content Security Policy (CSP)',
    steps: 'Añade una cabecera CSP para restringir de dónde se pueden cargar scripts.',
    code: {
      express: "app.use(helmet.contentSecurityPolicy());",
      vercel: '{\n  "headers": [{\n    "source": "/(.*)",\n    "headers": [{"key": "Content-Security-Policy", "value": "default-src \'self\';"}]\n  }]\n}'
    }
  },
  'XFO_MISSING': {
    title: 'Prevenir Clickjacking',
    steps: 'Configura el header X-Frame-Options para evitar que tu sitio sea embebido.',
    code: {
      express: "res.setHeader('X-Frame-Options', 'DENY');",
      nextjs: "// En next.config.js\nheaders: [{ key: 'X-Frame-Options', value: 'DENY' }]"
    }
  },
  'EXPOSED_FIREBASE_KEY': {
    title: 'Rotar y Restringir API Key',
    steps: 'Has expuesto una clave de Firebase. Debes rotarla en la consola de Google Cloud y añadir restricciones de dominio (HTTP Referrer).',
    link: 'https://console.cloud.google.com/apis/credentials'
  },
  'SOURCEMAP_EXPOSED': {
    title: 'Deshabilitar Source Maps en Producción',
    steps: 'Los source maps permiten reconstruir tu código original. Configura tu build para no generarlos.',
    code: {
      react: "GENERATE_SOURCEMAP=false npm run build",
      nextjs: "productionBrowserSourceMaps: false // en next.config.js"
    }
  }
};

module.exports = remediationData;