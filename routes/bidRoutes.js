const { Router } = require("express");
const router = Router();

const { validateToken } = require("../utils/jwt");
const bidController = require("../controllers/bidController");

router.get("/seller/:id/:productId", validateToken, bidController.viewSellerBidRequestsByProductId); // received
router.get("/seller/:id", validateToken, bidController.viewSellerBidRequests); // received
router.get("/buyer/:id", validateToken, bidController.viewBuyerBidRequests); // sent
router.post("/create", validateToken, bidController.createBid);
router.post("/accept", validateToken, bidController.acceptBid);
router.post("/reject", validateToken, bidController.rejectBid);

module.exports = router;