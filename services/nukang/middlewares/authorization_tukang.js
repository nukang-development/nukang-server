module.exports = (req, res, next) => {
  try {
    console.log(req.userData);
    if (req.userData.role !== "admin") {
      throw {
        status: 401,
        message: "Only Tukang",
      };
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};
