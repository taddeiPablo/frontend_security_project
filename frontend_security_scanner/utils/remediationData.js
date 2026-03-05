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
  },
  // --- DETECCIÓN DE SECRETOS (Nuevos) ---
  'EXPOSED_FIREBASE_KEY': {
    title: 'Clave de Firebase Expuesta',
    steps: 'Se encontró una clave de Firebase. Si bien suelen ser públicas, deben restringirse por dominio (HTTP Referrer) en la consola de Google Cloud para evitar que terceros consuman tu cuota.',
    link: 'https://console.cloud.google.com/apis/credentials'
  },
  'EXPOSED_STRIPE_KEY': {
    title: 'CRÍTICO: Clave de Stripe Detectada',
    steps: 'Has expuesto una clave de Stripe. Si es una "Secret Key" (sk_), debes invalidarla INMEDIATAMENTE en el dashboard de Stripe y generar una nueva. Si es una "Publishable Key" (pk_), asegúrate de que esté limitada a tu dominio.',
    link: 'https://dashboard.stripe.com/apikeys'
  },
  'EXPOSED_AWS_KEY': {
    title: 'CRÍTICO: Credenciales de AWS en Frontend',
    steps: 'Nunca debes incluir llaves de AWS en el código cliente. Un atacante podría tomar control de tu infraestructura. Revoca estas llaves ahora mismo en la consola de IAM y usa roles temporales o un backend para estas operaciones.',
    link: 'https://console.aws.amazon.com/iam/'
  },
  'EXPOSED_GENERIC_API_KEY': {
    title: 'Posible API Key Expuesta',
    steps: 'Se detectó un patrón de clave privada o token de autenticación. Mueve este valor a un archivo .env y asegúrate de que no se envíe al navegador.',
    code: {
      env: "// En tu .env\nMY_API_KEY=tu_valor_secreto\n\n// En tu backend\nconst key = process.env.MY_API_KEY;"
    }
  },
  // --- INFRAESTRUCTURA ---
  'SOURCEMAP_EXPOSED': {
    title: 'Source Maps Expuestos',
    steps: 'Los archivos .map permiten a cualquier persona ver tu código fuente original (sin minificar). Desactívalos para el entorno de producción.',
    code: {
      react: "GENERATE_SOURCEMAP=false npm run build",
      nextjs: "productionBrowserSourceMaps: false // en next.config.js"
    }
  },
  // --- ARCHIVOS EXPUESTOS ---
  'EXPOSED_ENV': {
    title: 'Archivo .env expuesto',
    steps: 'Tu archivo de variables de entorno es público. Esto expone todas tus claves secretas.',
    code: {
      apache: "# En .htaccess\nRedirectMatch 404 /\\.env",
      nginx: "location ~ /\\.env {\n  deny all;\n}"
    }
  },
  'EXPOSED_GIT': {
    title: 'Repositorio Git expuesto',
    steps: 'La carpeta .git es pública. Un atacante podría descargar todo tu código fuente.',
    steps_extra: 'Asegúrate de configurar tu servidor para denegar el acceso a carpetas que comiencen con punto (.).'
  },
  'EXPOSED_PACKAGE_JSON': {
    title: 'Archivo package.json visible',
    steps: 'Revela todas las dependencias y versiones de tu proyecto, facilitando ataques dirigidos.',
    steps_extra: 'Mueve este archivo fuera de la carpeta pública o restringe su acceso en el servidor.'
  },
  'CORS_WILDCARD': {
    title: 'CORS Wildcard detectado (*)',
    steps: 'Tu servidor permite peticiones desde cualquier origen (Access-Control-Allow-Origin: *). Esto permite que sitios maliciosos realicen peticiones en nombre de tus usuarios.',
    code: {
      express: "// En lugar de app.use(cors())\napp.use(cors({\n  origin: 'https://tu-dominio-oficial.com',\n  optionsSuccessStatus: 200\n}));",
      nextjs: "// En next.config.js\nasync headers() {\n  return [\n    {\n      source: '/api/:path*',\n      headers: [{ key: 'Access-Control-Allow-Origin', value: 'https://tu-dominio.com' }]\n    }\n  ]\n}"
    }
  }
};

module.exports = remediationData;