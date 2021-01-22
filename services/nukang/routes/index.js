const router = require("express").Router();
const routeAdmin = require("./admin");
const routeUser = require("./user");

router.use("/admin", routeAdmin);
router.use("/user", routeUser);

module.exports = router;
