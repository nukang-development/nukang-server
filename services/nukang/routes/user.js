const router = require("express").Router();
const UserController = require("../controllers/user-controller");
const authentication = require("../middlewares/authentication");
const authorization_user = require("../middlewares/authorization_user");

router.post("/register", UserController.registerUser);
router.post("/login", UserController.loginUser);
router.post(
  "/order",
  authentication,
  authorization_user,
  UserController.createOrder
);
router.put(
  "/order/:id/done",
  authentication,
  authorization_user,
  UserController.updateOrderDone
);
router.get(
  "/order/:id",
  authentication,
  authorization_user,
  UserController.findByUser
);

router.get(
  "/tukang/:id/detail",
  authentication,
  authorization_user,
  UserController.getTukangDetail
);
module.exports = router;
