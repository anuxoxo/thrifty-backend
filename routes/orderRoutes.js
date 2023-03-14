const { Router } = require("express");
const router = Router();

const { validateToken } = require("../utils/jwt");
const orderController = require("../controllers/orderController");

router.get("/", validateToken, orderController.getOrderDetails);

module.exports = router;