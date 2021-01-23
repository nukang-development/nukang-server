const router = require("express").Router();
const TukangController = require("../controllers/tukang-controller");
const authentication = require("../middlewares/authentication");
const authorization_tukang = require("../middlewares/authorization_tukang");
const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 5000000,
  },
});

router.get(
  "/order/:id",
  authentication,
  authorization_tukang,
  TukangController.findByTukang
);
router.put(
  "/order/:id/accepted",
  authentication,
  authorization_tukang,
  TukangController.updateOrderAccepted
);
router.put(
  "/order/:id/rejected",
  authentication,
  authorization_tukang,
  TukangController.updateOrderRejected
);
router.put(
  "/:id",
  authentication,
  authorization_tukang,
  upload.array("url"),
  TukangController.updateTukang
);
router.post("/login", TukangController.loginTukang);
router.get(
  "/:id",
  authentication,
  authorization_tukang,
  TukangController.findOneTukang
);
module.exports = router;
