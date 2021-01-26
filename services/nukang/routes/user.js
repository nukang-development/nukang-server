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
  "/order/bytukang/:id",
  authentication,
  authorization_user,
  UserController.findOrderByTukang
);

router.get(
  "/tukang",
  authentication,
  authorization_user,
  UserController.getAllTukangData
);

router.get(
  "/tukang/:id/detail",
  authentication,
  authorization_user,
  UserController.getTukangDetail
);
router.get(
  "/:id",
  authentication,
  authorization_user,
  UserController.getUserProfile
);

module.exports = router;
