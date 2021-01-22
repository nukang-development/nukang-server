const OrderModel = require("../models/order");

class OrderController {
  static createOrder(req, res) {
    OrderModel.createOne({
      userId: req.body.userId,
      tukangId: req.body.tukangId,
      schedule: req.body.schedule,
    })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static updateOrderStatus(req, res) {
    OrderModel.updateOne(req.params.id)
      .then((data) => {
        res.json(data.value);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static findByUser(req, res) {
    OrderModel.findAllbyUser(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static findByTukang(req, res) {
    OrderModel.findAllbyTukang(req.params.id)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send(err);
      });
  }

  static findAllOrder(req, res) {
    OrderModel.findAll()
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.send(err);
      });
  }
}

module.exports = OrderController;
