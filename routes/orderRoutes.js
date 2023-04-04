const { Router } = require("express");
const router = Router();

const { validateToken } = require("../utils/jwt");
const orderController = require("../controllers/orderController");

router.post("/", validateToken, orderController.getOrderDetails);

module.exports = router;