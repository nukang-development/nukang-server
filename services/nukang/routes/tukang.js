const router = require("express").Router();
const TukangController = require("../controllers/tukang-controller");
const multer = require("multer");

const upload = multer({
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
      return cb(new Error("Please upload image format"));
    }
    cb(undefined, true);
  },
});

router.put("/:id", upload.single("url"), TukangController.updateTukang);
router.post("/login", TukangController.loginTukang);
router.get("/:id", TukangController.findOneTukang);
module.exports = router;
