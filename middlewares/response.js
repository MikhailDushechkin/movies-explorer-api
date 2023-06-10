const { Message } = require('../utils/constants');

const responseError = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? Message.SERVER_ERROR : message,
  });
  next();
};

module.exports = responseError;
