const express = require("express");
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/order", authMiddleware, orderController.create);
router.get("/order/list", authMiddleware, orderController.findAll);
router.get("/order/:orderId", authMiddleware, orderController.findById);
router.put("/order/:orderId", authMiddleware, orderController.update);
router.delete("/order/:orderId", authMiddleware, orderController.remove);

module.exports = router;