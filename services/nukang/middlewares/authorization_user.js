module.exports = (req, res, next) => {
  try {
    if (!req.userData) {
      throw {
        status: 401,
        message: "Please Login First",
      };
    } else if (req.userData.role !== "user") {
      throw {
        status: 401,
        message: "Only User",
      };
    }
  } catch (err) {
    next(err);
  }
};
