const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const UnAuthorizedError = require('../errors/UnAuthorizedError');
const { Message } = require('../utils/constants');

// eslint-disable-next-line
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new UnAuthorizedError(Message.BAD_AUTH));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
    );
  } catch (err) {
    return next(new UnAuthorizedError(Message.BAD_AUTH));
  }

  req.user = payload;
  next();
};
