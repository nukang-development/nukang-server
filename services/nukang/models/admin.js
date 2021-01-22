const db = require("../config/mongo");
const Admin = db.collection("admin");
const Tukang = db.collection("tukangs");
const { ObjectId } = require("mongodb");
const { hash } = require("../helpers/bcrypt-helper");

class AdminModel {
  static login(payload) {
    return Admin.findOne({
      email: payload.email,
    });
  }
  static register(payload) {
    let hashed = hash(payload.password);
    return Admin.insertOne({
      email: payload.email,
      password: hashed,
      role: "admin",
    }).then((data) => {
      return data.ops[0];
    });
  }
  static createOne(payload) {
    let hashed = hash(payload.password);
    return Tukang.insertOne({
      email: payload.email,
      password: hashed,
      name: "",
      location: "",
      category: "",
      price: 0,
    }).then((data) => {
      return data.ops[0];
    });
  }

  static deleteOne(id) {
    return Tukang.findOneAndDelete({
      _id: ObjectId(id),
    });
  }
}

module.exports = AdminModel;
