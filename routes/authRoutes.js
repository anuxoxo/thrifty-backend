const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.get("/google", authController.googleAuth);

module.exports = router;