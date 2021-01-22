const db = require("../config/mongo");
const Order = db.collection("orders");
const Tukang = db.collection("tukangs");
const { ObjectId } = require("mongodb");

class OrderModel {
  static createOne(payload) {
    return Order.insertOne({
      userId: payload.userId,
      tukangId: payload.tukangId,
      schedule: payload.schedule,
      status: "pending",
    }).then((data) => {
      return data.ops[0];
    });
  }

  static updateOne(id) {
    return Order.findOneAndUpdate(
      { _id: ObjectId(id) },
      {
        $set: {
          status: "accepted",
        },
      },
      {
        returnOriginal: false,
      }
    );
  }

  static findAllbyUser(id) {
    return Order.find({ userId: id }).toArray();
  }

  static findAllbyTukang(id) {
    return Order.find({ tukangId: id }).toArray();
  }

  static findAll() {
    return Order.find().toArray();
  }
}

module.exports = OrderModel;
