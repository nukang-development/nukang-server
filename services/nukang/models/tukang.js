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
          price: payload.price,
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
}

module.exports = TukangModel;
