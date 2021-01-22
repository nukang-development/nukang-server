const router = require("express").Router();
const routeAdmin = require("./admin");

router.use("/admin", routeAdmin);

module.exports = router;
