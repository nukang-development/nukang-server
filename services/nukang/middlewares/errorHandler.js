module.exports = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({
      message: err.message,
    });
  } else if (err.name == "SequelizeValidationError") {
    let errors = err.errors.map((e) => ({
      message: e.message,
    }));
    res.status(400).json(errors);
  } else {
    res.status(500).json(err);
    console.log(err);
  }
};
