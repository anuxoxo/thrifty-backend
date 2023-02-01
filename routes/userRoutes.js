const { Router } = require("express");
const router = Router();

const { validateToken } = require("../utils/jwt");
const userController = require("../controllers/userController");

router.get("/me/:id", validateToken, userController.getUserDetails);
router.patch("/update-details", validateToken, userController.updateUserDetails);

module.exports = router;