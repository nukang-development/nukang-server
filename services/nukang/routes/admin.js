const router = require("express").Router();
const AdminController = require("../controllers/admin-controller");
const authentication = require("../middlewares/authentication");

router.post("/register", AdminController.registerAdmin);
router.post("/login", AdminController.loginAdmin);
router.post("/tukang", authentication, AdminController.createTukang);
router.put("/tukang/:id", authentication, AdminController.updateTukang);
router.delete("/tukang/:id", authentication, AdminController.deleteTukang);

module.exports = router;
