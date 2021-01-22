const router = require("express").Router();
const TukangController = require("../controllers/tukang-controller");

router.put("/:id", TukangController.updateTukang);
router.post("/login", TukangController.loginTukang);
module.exports = router;
