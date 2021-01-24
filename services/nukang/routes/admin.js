const router = require("express").Router();
const AdminController = require("../controllers/admin-controller");
const authentication = require("../middlewares/authentication");
const authorization_admin = require("../middlewares/authorization_admin");

router.get(
  "/order",
  authentication,
  authorization_admin,
  AdminController.findAllOrder
);
router.post("/register", AdminController.registerAdmin);
router.post("/login", AdminController.loginAdmin);
router.post(
  "/tukang",
  authentication,
  authorization_admin,
  AdminController.createTukang
);
router.delete(
  "/tukang/:id",
  authentication,
  authorization_admin,
  AdminController.deleteTukang
);

module.exports = router;
