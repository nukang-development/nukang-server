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
  static create(payload) {
    let hashed = hash(payload.password);
    return Admin.insertOne({
      email: payload.email,
      password: hashed,
    }).then((data) => {
      return data.ops[0];
    });
  }
  static addTukang(payload) {
    let hashed = hash(payload.password);
    return Tukang.insertOne({
      email: payload.email,
      password: hashed,
      location: "",
      name: "",
      category: "",
      price: "",
    }).then((data) => {
      return data.ops[0];
    });
  }
}

module.exports = AdminModel;
