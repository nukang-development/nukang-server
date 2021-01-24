const UserModel = require("../models/users");
const OrderModel = require("../models/order");
const { compare } = require("../helpers/bcrypt-helper");
const { encode } = require("../helpers/jwt-helper");

class UserController {
  static async registerUser(req, res, next) {
    try {
      if (req.body.email === "") {
        throw {
          status: 400,
          message: "Please Fill Email"
        }
      } else {
        const data = await UserModel.register({
          email: req.body.email,
          password: req.body.password,
        })
        res.status(201).json({ id: data._id, email: data.email });
      }
    } catch (error) {
      next(error)
    }
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

  static async createOrder(req, res, next) {
    try {
      if (req.body.userId) {
        const data = await OrderModel.createOne({
          userId: req.body.userId,
          tukangId: req.body.tukangId,
          schedule: req.body.schedule,
        })
        res.status(201).json(data);
      } else {
        throw {
          status: 400,
          message: "User ID required"
        }
      }
    } catch (error) {
      next(error)
    }
  }

  static async findByUser(req, res, next) {
    try {
      if (!Number(req.params.id)) {
        const data = await OrderModel.findAllbyUser(req.params.id)
        res.status(200).json(data);
      } else {
        throw {
          status: 404,
          message: "Error Not Found"
        }
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController;
