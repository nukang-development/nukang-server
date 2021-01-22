const AdminModel = require("../models/admin");
const { compare } = require("../helpers/bcrypt-helper");
const { encode } = require("../helpers/jwt-helper");

class AdminController {
  static loginAdmin(req, res) {
    AdminModel.login({
      email: req.body.email,
    })
      .then((data) => {
        console.log(data);
        if (!data) {
          res.json({ message: "Invalid Account" });
        } else if (compare(req.body.password, data.password)) {
          const access_token = encode(data);
          res.json(access_token);
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }
  static registerAdmin(req, res) {
    AdminModel.register({
      email: req.body.email,
      password: req.body.password,
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static createTukang(req, res) {
    AdminModel.createOne({
      email: req.body.email,
      password: req.body.password,
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static updateTukang(req, res) {
    AdminModel.updateOne({
      id: req.params.id,
      name: req.body.name,
      location: req.body.location,
      category: req.body.category,
      price: req.body.price,
    })
      .then((data) => {
        res.json(data.value);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static deleteTukang(req, res) {
    AdminModel.deleteOne(req.params.id)
      .then((data) => {
        res.json({ message: "success delete" });
      })
      .catch((err) => {
        res.send(err);
      });
  }
}

module.exports = AdminController;
