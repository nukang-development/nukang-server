module.exports = (req, res, next) => {
  try {
    console.log(req.userData);
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
