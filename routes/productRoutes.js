const { Router } = require("express");
const router = Router();

const { validateToken } = require("../utils/jwt");
const productController = require("../controllers/productController");

router.get("/", validateToken, productController.getProducts);
router.get("/:id", validateToken, productController.getProductById);
router.get("/category/:category", validateToken, productController.getProductsByCategory);
router.post("/add", validateToken, productController.createProduct);
router.patch("/update", validateToken, productController.updateProduct);
router.delete("/:id", validateToken, productController.deleteProduct);

module.exports = router;