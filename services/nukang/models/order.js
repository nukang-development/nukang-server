const db = require("../config/mongo");
const Order = db.collection("orders");
const { ObjectId } = require("mongodb");

class OrderModel {
  static createOne(payload) {
    return Order.insertOne({
      userId: payload.userId,
      userName: payload.userName,
      tukangId: payload.tukangId,
      tukangName: payload.tukangName,
      schedule: payload.schedule,
      contact: payload.contact,
      address: payload.address,
      total_price: payload.total_price,
      schedule: payload.schedule,
      comment: "",
      status: "pending",
    }).then((data) => {
      return data.ops[0];
    });
  }

  static updateAccept(id) {
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

  static updateReject(id) {
    return Order.findOneAndUpdate(
      { _id: ObjectId(id) },
      {
        $set: {
          status: "rejected",
        },
      },
      {
        returnOriginal: false,
      }
    );
  }

  static updateDone(payload) {
    return Order.findOneAndUpdate(
      { _id: ObjectId(payload.id) },
      {
        $set: {
          status: "done",
          comment: payload.comment,
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
