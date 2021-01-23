const UserModel = require("../models/users");
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
        next(err)
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

module.exports = UserController;
