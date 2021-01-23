module.exports = (req, res, next) => {
  try {
    if (!req.userData) {
      throw {
        status: 401,
        message: "Please Login First",
      };
    } else if (req.userData.role !== "admin") {
      throw {
        status: 401,
        message: "Only Admin",
      };
    }
  } catch (err) {
    next(err);
  }
};
