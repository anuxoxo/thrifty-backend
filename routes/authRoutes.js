const { Router } = require("express");
const router = Router();
const authController = require("../controllers/authController");

router.post("/google", authController.googleAuth);

module.exports = router;