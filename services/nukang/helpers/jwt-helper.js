const jwt = require("jsonwebtoken");

module.exports = {
  encode(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT
    );
  },
  decode(token) {
    return jwt.verify(token, process.env.JWT);
  },
};
