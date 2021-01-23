const TukangModel = require("../models/tukang");
const { compare } = require("../helpers/bcrypt-helper");
const { encode } = require("../helpers/jwt-helper");
const imgur = require("imgur");

class TukangController {
  static updateTukang(req, res) {
    console.log(req.file, "<<<< ini sebelum upload");
    const encodedImg = req.file.buffer.toString("base64");
    imgur
      .uploadBase64(encodedImg)
      .then((img) => {
        console.log(img);
        return TukangModel.updateOne({
          id: req.params.id,
          name: req.body.name,
          location: req.body.location,
          category: req.body.category,
          price: req.body.price,
          portofolio_img: img.data.link,
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
  }

  static findOneTukang(req, res, next) {
    TukangModel.findOne(req.params.id)
      .then((data) => {
        res.status(200).json({
          id: data._id,
          name: data.name,
          location: data.location,
          category: data.category,
          price: data.price,
          portofolio_img: data.portofolio_img,
        });
      })
      .catch((err) => {
        next(err)
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

module.exports = TukangController;
