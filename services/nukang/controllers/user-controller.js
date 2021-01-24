const UserModel = require("../models/users");
const OrderModel = require("../models/order");
const TukangModel = require("../models/tukang");
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

  // user bikin order
  static createOrder(req, res, next) {
    OrderModel.createOne({
      userId: req.body.userId,
      tukangId: req.body.tukangId,
      schedule: req.body.schedule,
      contact: req.body.contact,
      address: req.body.address,
      total_price: req.body.total_price,
    })
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((err) => {
        next(err);
      });
  }

  // get  data orderan yang memiliki id user
  static findByUser(req, res, next) {
    OrderModel.findAllbyUser(req.params.id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  }

  // get detail profile tukang
  static getTukangDetail(req, res, next) {
    TukangModel.findOne(req.params.id)
      .then((data) => {
        res.status(200).json({
          id: data._id,
          name: data.name,
          location: data.location,
          category: data.category,
          small_project_desc: data.small_project_desc,
          small_project_price: data.small_project_price,
          medium_project_desc: data.medium_project_desc,
          medim_project_price: data.medium_project_price,
          big_project_desc: data.big_project_desc,
          big_project_price: data.big_project_price,
          portofolio_img: data.portofolio_img,
        });
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = UserController;
