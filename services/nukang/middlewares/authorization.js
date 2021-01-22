const { Product } = require("../models");

module.exports = (req, res, next) => {
  Product.findOne({ where: { id: req.params.id } })
    .then((data) => {
      if (!data) {
        res.status(404).json({
          message: "Not Found",
        });
      } else if (req.userData.role != "admin") {
        res.status(401).json({
          message: "Only Admin",
        });
      } else {
        next();
      }
    })
    .catch((err) => {
      res.status(500).json(err);
      console.log(err);
    });
};
