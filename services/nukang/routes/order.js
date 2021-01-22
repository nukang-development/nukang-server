const router = require("express").Router();
const OrderController = require("../controllers/order-controller");

router.post("/", OrderController.createOrder);
router.get("/user/:id", OrderController.findByUser);
router.get("/tukang/:id", OrderController.findByTukang);
router.get("/", OrderController.findAllOrder);
router.put("/:id", OrderController.updateOrderStatus);
module.exports = router;
