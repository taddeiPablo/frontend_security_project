const jwt = require("jsonwebtoken");

module.exports = function authGuard(req, res, next) {
 const token = req.cookies.auth_token;

  if (!token) {
    return res.redirect("/users/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { 
      id: decoded.id,
      email: decoded.email == null ? "No registrado" : decoded.email 
    };
    res.locals.user = req.user;
    next();
    
  } catch (error) {
    res.clearCookie("auth_token");
    res.locals.user = null;
    return res.redirect("/users/login");
  }
};