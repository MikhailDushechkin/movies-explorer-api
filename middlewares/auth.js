const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const UnAuthorizedError = require('../errors/UnAuthorizedError');
const { Message } = require('../utils/constants');
const { jwtSecret } = require('../utils/config');

// eslint-disable-next-line
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : jwtSecret,
    );
  } catch (err) {
    return next(new UnAuthorizedError(Message.BAD_AUTH));
  }

  req.user = payload;
  next();
};
