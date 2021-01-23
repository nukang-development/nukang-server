const AdminModel = require("../models/admin");
const OrderModel = require("../models/order");
const { compare } = require("../helpers/bcrypt-helper");
const { encode } = require("../helpers/jwt-helper");

class AdminController {
  static loginAdmin(req, res, next) {
    AdminModel.login({
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
  static registerAdmin(req, res, next) {
    AdminModel.register({
      email: req.body.email,
      password: req.body.password,
    })
      .then((data) => {
        res.status(201).json({ id: data._id, email: data.email });
      })
      .catch((err) => {
        next(err);
      });
  }

  static createTukang(req, res, next) {
    AdminModel.createOne({
      email: req.body.email,
      password: req.body.password,
    })
      .then((data) => {
        res.status(201).json({
          id: data._id,
          email: data.email,
          role: data.role,
          name: data.name,
          location: data.location,
          category: data.category,
          price: data.price,
          portofolio_img: data.portofolio_img,
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  static deleteTukang(req, res, next) {
    AdminModel.deleteOne(req.params.id)
      .then((data) => {
        res.status(200).json({ message: "success delete" });
      })
      .catch((err) => {
        next(err);
      });
  }

  static findAllOrder(req, res, next) {
    OrderModel.findAll()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = AdminController;
