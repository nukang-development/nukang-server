module.exports = (req, res, next) => {
  try {
    if (req.userData.role !== "admin") {
      throw {
        status: 401,
        message: "Only Admin",
      };
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};
