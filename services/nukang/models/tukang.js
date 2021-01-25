const db = require("../config/mongo");
const Tukang = db.collection("tukangs");
const { ObjectId } = require("mongodb");

class TukangModel {
  static updateOne(payload) {
    return Tukang.findOneAndUpdate(
      {
        _id: ObjectId(payload.id),
      },
      {
        $set: {
          name: payload.name,
          location: payload.location,
          category: payload.category,
          small_project_desc: payload.small_project_desc,
          small_project_price: payload.small_project_price,
          medium_project_desc: payload.medium_project_desc,
          medium_project_price: payload.medium_project_price,
          big_project_desc: payload.big_project_desc,
          big_project_price: payload.big_project_price,
        },
      },
      {
        returnOriginal: false,
      }
    );
  }

  static updateImages(payload) {
    console.log(payload);
    return Tukang.findOneAndUpdate(
      {
        _id: ObjectId(payload.id),
      },
      {
        $set: {
          portofolio_img: payload.portofolio_img,
        },
      },
      {
        returnOriginal: false,
      }
    );
  }

  static updateAvatar(payload) {
    console.log(payload);
    return Tukang.findOneAndUpdate(
      {
        _id: ObjectId(payload.id),
      },
      {
        $set: {
          avatar_img: payload.avatar_img,
        },
      },
      {
        returnOriginal: false,
      }
    );
  }

  static login(payload) {
    return Tukang.findOne({
      email: payload.email,
    });
  }

  static getAll() {
    return Tukang.find().toArray();
  }

  static findOne(id) {
    return Tukang.findOne({
      _id: ObjectId(id),
    });
  }
}

module.exports = TukangModel;
