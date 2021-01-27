const router = require("express").Router();
const routeAdmin = require("./admin");
const routeUser = require("./user");
const routeTukang = require("./tukang");

router.use("/admin", routeAdmin);
router.use("/user", routeUser);
router.use("/tukang", routeTukang);

module.exports = router;
