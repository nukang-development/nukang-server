const TukangModel = require("../models/tukang");
const { compare } = require("../helpers/bcrypt-helper");
const { encode } = require("../helpers/jwt-helper");

class TukangController {
  static updateTukang(req, res, next) {
    TukangModel.updateOne({
      id: req.params.id,
      name: req.body.name,
      location: req.body.location,
      category: req.body.category,
      price: req.body.price,
    })
      .then((data) => {
        res.status(200).json(data.value);
      })
      .catch((err) => {
        next(err)
      });
  }

  static findOneTukang(req, res, next) {
    TukangModel.findOne(req.params.id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err)
      });
  }

  static loginTukang(req, res, next) {
    TukangModel.login({
      email: req.body.email,
    })
      .then((data) => {
        if (!data) {
          throw {
            status: 400,
            message: "Invalid Account"
          }
        } else if (compare(req.body.password, data.password)) {
          const access_token = encode(data);
          res.status(200).json({ access_token: access_token });
        }
      })
      .catch((err) => {
        next(err)
      });
  }
}

module.exports = TukangController;
