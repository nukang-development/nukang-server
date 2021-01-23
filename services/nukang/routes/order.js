const router = require("express").Router();
const OrderController = require("../controllers/order-controller");
const authentication = require("../middlewares/authentication");

router.post("/", authentication, OrderController.createOrder);
router.get("/user/:id", authentication, OrderController.findByUser);
router.get("/tukang/:id", authentication, OrderController.findByTukang);
router.get("/", authentication, OrderController.findAllOrder);
router.put(
  "/accepted/:id",
  authentication,
  OrderController.updateOrderAccepted
);
router.put(
  "/rejected/:id",
  authentication,
  OrderController.updateOrderRejected
);

module.exports = router;
