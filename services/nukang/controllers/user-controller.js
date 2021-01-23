const UserModel = require("../models/users");
const OrderModel = require("../models/order");
const { compare } = require("../helpers/bcrypt-helper");
const { encode } = require("../helpers/jwt-helper");

class UserController {
  static registerUser(req, res, next) {
    UserModel.register({
      email: req.body.email,
      password: req.body.password,
    })
      .then((data) => {
        res.status(200).json({ id: data._id, email: data.email });
      })
      .catch((err) => {
        next(err);
      });
  }

  static loginUser(req, res, next) {
    UserModel.login({
      email: req.body.email,
    })
      .then((data) => {
        if (!data) {
          throw {
            status: 400,
            message: "Invalid Account",
          };
        } else if (compare(req.body.password, data.password)) {
          const access_token = encode(data);
          res.status(200).json({ access_token: access_token });
        }
      })
      .catch((err) => {
        next(err);
      });
  }

  static createOrder(req, res, next) {
    OrderModel.createOne({
      userId: req.body.userId,
      tukangId: req.body.tukangId,
      schedule: req.body.schedule,
    })
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((err) => {
        next(err);
      });
  }

  static findByUser(req, res, next) {
    console.log(req.params.id);
    OrderModel.findAllbyUser(req.params.id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = UserController;
