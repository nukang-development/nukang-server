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
          throw {
            status: 401,
            message: "Invalid Account",
          };
        } else if (compare(req.body.password, data.password)) {
          const access_token = encode(data);
          res.json(access_token);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  static registerAdmin(req, res) {
    AdminModel.create({
      email: req.body.email,
      password: req.body.password,
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static createTukang(req, res) {
    AdminModel.addTukang({
      email: req.body.email,
      password: req.body.password,
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = AdminController;
