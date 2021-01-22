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
        res.status(200).json({ id: data._id, email: data.email });
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
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
          res.status(200).json({ access_token: access_token });
        }
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
      });
  }
}

module.exports = UserController;
