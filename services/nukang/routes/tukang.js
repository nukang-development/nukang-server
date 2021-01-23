const router = require("express").Router();
const TukangController = require("../controllers/tukang-controller");
const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 5000000,
  },
});

router.put("/:id", upload.array("url"), TukangController.updateTukang);
router.post("/login", TukangController.loginTukang);
router.get("/:id", TukangController.findOneTukang);
module.exports = router;
