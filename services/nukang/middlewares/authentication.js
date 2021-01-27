const { decode } = require("../helpers/jwt-helper");

module.exports = (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw {
        status: 401,
        message: "Please Login First",
      };
    } else {
      const decoded = decode(access_token);
      req.userData = decoded;
      next();
    }
  } catch (err) {
    next(err);
  }
};
