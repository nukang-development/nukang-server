const OrderModel = require("../models/order");

class OrderController {
  static createOrder(req, res, next) {
    OrderModel.createOne({
      userId: req.body.userId,
      tukangId: req.body.tukangId,
      schedule: req.body.schedule,
    })
      .then((data) => {
        res.status(201).json(data);
      })
      .catch((err) => {
        next(err)
      });
  }

  static updateOrderStatus(req, res, next) {
    OrderModel.updateOne(req.params.id)
      .then((data) => {
        res.status(201).json(data.value);
      })
      .catch((err) => {
        next(err)
      });
  }

  static findByUser(req, res, next) {
    OrderModel.findAllbyUser(req.params.id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err)
      });
  }

  static findByTukang(req, res, next) {
    OrderModel.findAllbyTukang(req.params.id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err)
      });
  }

  static findAllOrder(req, res, next) {
    OrderModel.findAll()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        next(err)
      });
  }
}

module.exports = OrderController;
