const UserModel = require("../models/users");
const { compare } = require("../helpers/bcrypt-helper");
const { encode } = require("../helpers/jwt-helper");

class UserController {
  static registerUser(req, res) {
    UserModel.register({
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

  static loginUser(req, res) {
    UserModel.login({
      email: req.body.email,
    })
      .then((data) => {
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
}

module.exports = UserController;
