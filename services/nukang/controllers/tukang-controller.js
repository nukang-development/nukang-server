const TukangModel = require("../models/tukang");
const OrderModel = require("../models/order");
const { compare } = require("../helpers/bcrypt-helper");
const { encode } = require("../helpers/jwt-helper");
const imgur = require("imgur");

class TukangController {
  // update profile tukang
  static async updateTukang(req, res) {
    try {
      if (!Number(req.params.id)) {
        const data = await TukangModel.updateOne({
          id: req.params.id,
          name: req.body.name,
          location: req.body.location,
          category: req.body.category,
          small_project_desc: req.body.small_project_desc,
          small_project_price: req.body.small_project_price,
          medium_project_desc: req.body.medium_project_desc,
          medium_project_price: req.body.medium_project_price,
          big_project_desc: req.body.big_project_desc,
          big_project_price: req.body.big_project_price,
        });
        res.status(200).json({
          name: data.value.name,
          location: data.value.location,
          category: data.value.category,
          small_project_desc: data.value.small_project_desc,
          small_project_price: data.value.small_project_price,
          medium_project_desc: data.value.medium_project_desc,
          medium_project_price: data.value.medium_project_price,
          big_project_desc: data.value.big_project_desc,
          big_project_price: data.value.big_project_price,
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

  static async uploadImages(req, res, next) {
    try {
      let encodedImgArray = [];
      if (req.files.length !== 0) {
        for (let i = 0; i < req.files.length; i++) {
          encodedImgArray.push(req.files[i].buffer.toString("base64"));
        }
        const images = await imgur.uploadImages(encodedImgArray, "Base64");
        const data = await TukangModel.updateImages({
          id: req.params.id,
          portofolio_img: images,
        });
        res.status(201).json({
          portofolio_img: data.value.portofolio_img,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async uploadAvatar(req, res, next) {
    try {
      if (req.file.length !== 0) {
        const encoded_avatar = req.file.buffer.toString("base64");
        const image = await imgur.uploadBase64(encoded_avatar);
        console.log(image);
        const data = await TukangModel.updateAvatar({
          id: req.params.id,
          avatar_img: image.data,
        });
        console.log(data);
        res.status(201).json(data.value.avatar_img);
      }
    } catch (error) {
      next(error);
    }
  }

  static async findOneTukang(req, res, next) {
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
          medium_project_price: data.medium_project_price,
          big_project_desc: data.big_project_desc,
          big_project_price: data.big_project_price,
          portofolio_img: data.portofolio_img,
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

  static async loginTukang(req, res, next) {
    try {
      if (req.body.username === "") {
        throw {
          status: 400,
          message: "Please Fill Username",
        };
      } else {
        const data = await TukangModel.login({
          username: req.body.username,
        });
        if (!data) {
          throw {
            status: 400,
            message: "Invalid Account",
          };
        } else if (compare(req.body.password, data.password)) {
          console.log(data);
          const access_token = encode(data);
          res.status(200).json({ access_token: access_token, id: data._id });
        }
      }
    } catch (error) {
      next(error);
    }
  }

  static async findByTukang(req, res, next) {
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

  static async updateOrderAccepted(req, res, next) {
    try {
      if (!Number(req.params.id)) {
        const data = await OrderModel.updateAccept(req.params.id);
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

  static async updateOrderRejected(req, res, next) {
    try {
      if (!Number(req.params.id)) {
        const data = await OrderModel.updateReject(req.params.id);
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
}

module.exports = TukangController;
