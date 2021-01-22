const OrderModel = require("../models/order");

class OrderController {
  static createOrder(req, res) {
    OrderModel.createOne({
      userId: req.body.userId,
      tukangId: req.body.tukangId,
      schedule: req.body.schedule,
    })
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
      });
  }

  static updateOrderStatus(req, res) {
    OrderModel.updateOne(req.params.id)
      .then((data) => {
        res.status(201).json(data.value);
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
      });
  }

  static findByUser(req, res) {
    OrderModel.findAllbyUser(req.params.id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
      });
  }

  static findByTukang(req, res) {
    OrderModel.findAllbyTukang(req.params.id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
      });
  }

  static findAllOrder(req, res) {
    OrderModel.findAll()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        res.status(400).json({ message: "Internal Server Error" });
      });
  }
}

module.exports = OrderController;
