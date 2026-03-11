const jwt = require('jsonwebtoken');

const redirectIfAuth = (req, res, next) => {
    const token = req.cookies.auth_token; // O como hayas nombrado a tu cookie
    
    if (token) {
        try {
            // Verificamos si el token es válido
            jwt.verify(token, process.env.JWT_SECRET);
            
            // Si es válido, lo mandamos al dashboard
            return res.redirect('/users/dashboard'); 
        } catch (error) {
            // Si el token expiró o es inválido, limpiamos la cookie 
            // y dejamos que vea el Login/Register
            res.clearCookie('auth_token');
            return next();
        }
    }

    // Si no hay token, el usuario puede ver el Login/Register
    next();
};

module.exports = redirectIfAuth;