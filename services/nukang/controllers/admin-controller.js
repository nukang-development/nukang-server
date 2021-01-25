const AdminModel = require("../models/admin");
const TukangModel = require("../models/tukang");
const OrderModel = require("../models/order");
const { compare } = require("../helpers/bcrypt-helper");
const { encode } = require("../helpers/jwt-helper");

class AdminController {
  static async loginAdmin(req, res, next) {
    try {
      const data = await AdminModel.login({
        email: req.body.email,
      })
      if (!data) {
        throw {
          status: 400,
          message: "Invalid Account",
        };
      } else if (compare(req.body.password, data.password)) {
        const access_token = encode(data);
        res.status(200).json({ access_token: access_token, id: data._id });
      }
    } catch (error) {
      next(error)
    }
  }
  static async registerAdmin(req, res, next) {
    try {
      if (req.body.email === "") {
        throw {
          status: 400,
          message: "Please Fill Email",
        };
      } else {
        const data = await AdminModel.register({
          email: req.body.email,
          password: req.body.password,
        });
        res.status(201).json({ id: data._id, email: data.email });
      }
    } catch (error) {
      next(error);
    }
  }

  static async createTukang(req, res, next) {
    try {
      if (req.body.username === "") {
        throw {
          status: 400,
          message: "Please Fill Username",
        };
      } else {
        const data = await AdminModel.createOne({
          username: req.body.username,
          password: req.body.password,
        });
        res.status(201).json({
          id: data._id,
          username: data.username,
          role: data.role,
          name: data.name,
          location: data.location,
          category: data.category,
          small_project_desc: data.small_project_desc,
          small_project_price: data.small_project_price,
          medium_project_desc: data.medium_project_desc,
          medium_project_price: data.medium_project_price,
          big_project_desc: data.big_project_desc,
          big_project_price: data.big_project_price,
          portofolio_img: data.portofolio_img,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async deleteTukang(req, res, next) {
    try {
      if (!Number(req.params.id)) {
        const data = await AdminModel.deleteOne(req.params.id);
        res.status(200).json({ message: "success delete" });
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

  static async findAllOrder(req, res, next) {
    try {
      const data = await OrderModel.findAll()
      res.status(200).json(data);
    } catch (error) {
      next(error)
    }
  }

  // get all tukang data
  static async getAllTukangData(req, res, next) {
    try {
      const data = await TukangModel.getAll()
      res.status(200).json(data);
    } catch (error) {
      next(error)
    }
  }
}

module.exports = AdminController;
