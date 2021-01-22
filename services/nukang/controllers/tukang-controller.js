const TukangModel = require("../models/tukang");
const { compare } = require("../helpers/bcrypt-helper");
const { encode } = require("../helpers/jwt-helper");

class TukangController {
  static updateTukang(req, res) {
    TukangModel.updateOne({
      id: req.params.id,
      name: req.body.name,
      location: req.body.location,
      category: req.body.category,
      price: req.body.price,
    })
      .then((data) => {
        res.status(201).json(data.value);
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
      });
  }

  static findOneTukang(req, res) {
    TukangModel.findOne(req.params.id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
      });
  }

  static loginTukang(req, res) {
    TukangModel.login({
      email: req.body.email,
    })
      .then((data) => {
        if (!data) {
          res.json({ message: "Invalid Account" });
        } else if (compare(req.body.password, data.password)) {
          const access_token = encode(data);
          res.status(200).json({ access_token: access_token });
        }
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
      });
  }
}

module.exports = TukangController;
