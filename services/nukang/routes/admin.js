const router = require("express").Router();
const AdminController = require("../controllers/admin-controller");
const authentication = require("../middlewares/authentication");

router.post("/register", AdminController.registerAdmin);
router.post("/login", AdminController.loginAdmin);
router.post("/create", AdminController.createTukang);

module.exports = router;
