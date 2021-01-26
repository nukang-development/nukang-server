const UserModel = require("../models/users");
const OrderModel = require("../models/order");
const TukangModel = require("../models/tukang");
const { compare } = require("../helpers/bcrypt-helper");
const { encode } = require("../helpers/jwt-helper");
const { createTukang } = require("./admin-controller");

class UserController {
  static async registerUser(req, res, next) {
    try {
      if (req.body.email === "") {
        throw {
          status: 400,
          message: "Please Fill Email",
        };
      } else {
        const data = await UserModel.register({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
        });
        res
          .status(201)
          .json({ id: data._id, email: data.email, name: data.name });
      }
    } catch (error) {
      next(error);
    }
  }

  static async loginUser(req, res, next) {
    try {
      if (req.body.email === "") {
        throw {
          status: 400,
          message: "Please Fill Email",
        };
      } else {
        const data = await UserModel.login({
          email: req.body.email,
        });
        if (!data) {
          throw {
            status: 400,
            message: "Invalid Account",
          };
        } else if (compare(req.body.password, data.password)) {
          const access_token = encode(data);
          res.status(200).json({ access_token: access_token, id: data._id });
        } else {
          throw {
            status: 400,
            message: "Invalid Account",
          };
        }
      }
    } catch (error) {
      next(error);
    }
  }

  static async createOrder(req, res, next) {
    try {
      if (req.body.userId) {
        const userData = await UserModel.findOneProfile(req.body.userId);
        const tukangData = await TukangModel.findOne(req.body.tukangId);
        const data = await OrderModel.createOne({
          userId: req.body.userId,
          userName: userData.name,
          tukangId: req.body.tukangId,
          tukangName: tukangData.name,
          schedule: req.body.schedule,
          contact: req.body.contact,
          address: req.body.address,
          total_price: req.body.total_price,
        });
        res.status(201).json(data);
      } else {
        throw {
          status: 400,
          message: "User ID required",
        };
      }
    } catch (error) {
      next(error);
    }
  }

  static async findByUser(req, res, next) {
    try {
      if (!Number(req.params.id)) {
        const data = await OrderModel.findAllbyUser(req.params.id);
        res.status(200).json(data);
      } else {
        throw {
          status: 404,
          message: "Error Not Found",
        };
      }
    } catch (error) {
      next(error);
    }
  }

  // user selesai order
  static async updateOrderDone(req, res, next) {
    try {
      if (!Number(req.params.id)) {
        const data = await OrderModel.updateDone({
          id: req.params.id,
          comment: req.body.comment,
        });
        res.status(200).json(data.value);
      } else {
        throw {
          status: 404,
          message: "Error Not Found",
        };
      }
    } catch (error) {
      next(error);
    }
  }

  // get detail profile tukang
  static async getTukangDetail(req, res, next) {
    try {
      if (!Number(req.params.id)) {
        const data = await TukangModel.findOne(req.params.id);
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
          avatar_img: data.avatar_img.link,
        });
      } else {
        throw {
          status: 404,
          message: "Error Not Found",
        };
      }
    } catch (error) {
      next(error);
    }
  }

  static async getUserProfile(req, res, next) {
    try {
      if (!Number(req.params.id)) {
        const data = await UserModel.findOneProfile(req.params.id);
        res.status(200).json({
          id: data._id,
          email: data.email,
          name: data.name,
        });
      } else {
        throw {
          status: 404,
          message: "Error Not Found",
        };
      }
    } catch (error) {
      next(error);
    }
  }

  // find order by tukang
  static async findOrderByTukang(req, res, next) {
    console.log("masuk");
    try {
      if (!Number(req.params.id)) {
        const data = await OrderModel.findAllbyTukang(req.params.id);
        res.status(200).json(data);
      } else {
        throw {
          status: 404,
          message: "Error Not Found",
        };
      }
    } catch (error) {
      next(error);
    }
  }

  // get all tukang data
  static async getAllTukangData(req, res, next) {
    try {
      const data = await TukangModel.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
