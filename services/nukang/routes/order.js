const router = require("express").Router();
const OrderController = require("../controllers/order-controller");
const authentication = require("../middlewares/authentication");

router.post("/", authentication, OrderController.createOrder);
router.get("/user/:id", authentication, OrderController.findByUser);
router.get("/tukang/:id", authentication, OrderController.findByTukang);
router.get("/", authentication, OrderController.findAllOrder);
router.put("/:id", authentication, OrderController.updateOrderStatus);

module.exports = router;
