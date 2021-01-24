const TukangModel = require("../models/tukang");
const OrderModel = require("../models/order");
const { compare } = require("../helpers/bcrypt-helper");
const { encode } = require("../helpers/jwt-helper");
const imgur = require("imgur");

class TukangController {
  // update profile tukang
  static updateTukang(req, res) {
    let encodedImgArray = [];
    for (let i = 0; i < req.files.length; i++) {
      encodedImgArray.push(req.files[i].buffer.toString("base64"));
    }
    imgur
      .uploadImages(encodedImgArray, "Base64")
      .then((images) => {
        return TukangModel.updateOne({
          id: req.params.id,
          name: req.body.name,
          location: req.body.location,
          category: req.body.category,
          price: req.body.price,
          portofolio_img: images,
        })
          .then((data) => {
            res.status(201).json({
              id: data.value._id,
              name: data.value.name,
              location: data.value.location,
              category: data.value.category,
              price: data.value.price,
              portofolio_img: data.value.portofolio_img,
            });
          })
          .catch((err) => {
            res.status(400).json({ message: "Internal Server Error" });
          });
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
      });
  }

  // get data profile tukang
  static findOneTukang(req, res, next) {
    TukangModel.findOne(req.params.id)
      .then((data) => {
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
        });
      })
      .catch((err) => {
        next(err);
      });
  }

  static loginTukang(req, res, next) {
    TukangModel.login({
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

  // get data order yang memiliki id tukang
  static findByTukang(req, res, next) {
    OrderModel.findAllbyTukang(req.params.id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err);
      });
  }

  static updateOrderAccepted(req, res, next) {
    OrderModel.updateAccept(req.params.id)
      .then((data) => {
        res.status(201).json(data.value);
      })
      .catch((err) => {
        next(err);
      });
  }

  static updateOrderRejected(req, res, next) {
    OrderModel.updateReject(req.params.id)
      .then((data) => {
        res.status(201).json(data.value);
      })
      .catch((err) => {
        next(err);
      });
  }
}

module.exports = TukangController;
