const router = require("express").Router();
const routeAdmin = require("./admin");
const routeUser = require("./user");
const routeOrder = require("./order");

router.use("/admin", routeAdmin);
router.use("/user", routeUser);
router.use("/order", routeOrder);

module.exports = router;
