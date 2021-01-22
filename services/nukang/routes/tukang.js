const router = require("express").Router();
const TukangController = require("../controllers/tukang-controller");

router.put("/:id", TukangController.updateTukang);
router.post("/login", TukangController.loginTukang);
router.get("/:id", TukangController.findOneTukang);
module.exports = router;
