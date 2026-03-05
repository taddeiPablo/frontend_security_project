const axios = require('axios');

async function analyzeExposedFiles(targetUrl) {
    const findings = [];
    // Limpiamos la URL para asegurar que termine sin "/"
    const baseUrl = targetUrl.replace(/\/$/, "");

    // Lista de archivos críticos a verificar
    const criticalPaths = [
        { path: '/.env', id: 'EXPOSED_ENV' },
        { path: '/.git/config', id: 'EXPOSED_GIT' },
        { path: '/package.json', id: 'EXPOSED_PACKAGE_JSON' },
        { path: '/firebase.json', id: 'EXPOSED_FIREBASE_CONFIG' },
        { path: '/wp-config.php.bak', id: 'EXPOSED_BACKUP' },
        { path: '/api/files', id: 'DIRECTORY_LISTING' },
        { path: '/debug', id: 'VERBOSE_ERRORS' }
    ];

    // Ejecutamos las peticiones en paralelo para que el scan no sea lento
    const scanPromises = criticalPaths.map(async (item) => {
        try {
            const response = await axios.get(`${baseUrl}${item.path}`, { 
                timeout: 5000, 
                maxRedirects: 2,
                validateStatus: (status) => status === 200 // Solo nos importa si responde 200
            });

            // Si llegamos aquí, el archivo es accesible
            findings.push({
                id: item.id,
                severity: 'high',
                title: `Archivo crítico expuesto: ${item.path}`,
                description: `Se detectó que el archivo ${item.path} es accesible públicamente.`,
                impact: 'Este archivo puede contener credenciales de base de datos, claves de API o secretos del servidor.'
            });
        } catch (error) {
            // Un error (404, 403) es lo esperado, significa que el archivo está protegido.
        }
    });

    await Promise.all(scanPromises);
    return findings;
}

module.exports = { analyzeExposedFiles };