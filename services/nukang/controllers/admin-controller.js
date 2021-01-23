const AdminModel = require("../models/admin");
const { compare } = require("../helpers/bcrypt-helper");
const { encode } = require("../helpers/jwt-helper");

class AdminController {
  static loginAdmin(req, res) {
    AdminModel.login({
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
        res.send(err);
      });
  }
  static registerAdmin(req, res) {
    AdminModel.register({
      email: req.body.email,
      password: req.body.password,
    })
      .then((data) => {
        res.status(200).json({ id: data._id, email: data.email });
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
      });
  }

  static createTukang(req, res) {
    AdminModel.createOne({
      email: req.body.email,
      password: req.body.password,
    })
      .then((data) => {
        res.status(201).json({
          id: data._id,
          email: data.email,
          name: data.name,
          location: data.location,
          category: data.category,
          price: data.price,
          portofolio_img: data.portofolio_img,
        });
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
      });
  }

  static deleteTukang(req, res) {
    AdminModel.deleteOne(req.params.id)
      .then((data) => {
        res.status(200).json({ message: "success delete" });
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
      });
  }
}

module.exports = AdminController;
