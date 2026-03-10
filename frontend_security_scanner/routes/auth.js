var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");

// acciones
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

module.exports = router;