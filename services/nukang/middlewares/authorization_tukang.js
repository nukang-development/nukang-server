module.exports = (req, res, next) => {
  try {
    if (!req.userData) {
      throw {
        status: 401,
        message: "Please Login First",
      };
    } else if (req.userData.role !== "tukang") {
      throw {
        status: 401,
        message: "Only Tukang",
      };
    }
  } catch (err) {
    next(err);
  }
};
