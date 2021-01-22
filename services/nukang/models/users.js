const db = require("../config/mongo");
const User = db.collection("users");
const { hash } = require("../helpers/bcrypt-helper");

class UserModel {
  static register(payload) {
    let hashed = hash(payload.password);
    return User.insertOne({
      email: payload.email,
      password: hashed,
      role: "user",
    }).then((data) => {
      return data.ops[0];
    });
  }

  static login(payload) {
    return User.findOne({
      email: payload.email,
    });
  }
}

module.exports = UserModel;
