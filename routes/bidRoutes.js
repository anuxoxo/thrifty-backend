const { Router } = require("express");
const router = Router();

const { validateToken } = require("../utils/jwt");
const bidController = require("../controllers/bidController");

router.get("/:id", validateToken, bidController.viewBidRequests);

module.exports = router;