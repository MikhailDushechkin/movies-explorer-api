const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UnAuthorizedError = require('../errors/UnAuthorizedError');
const { Message } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: Message.BAD_EMAIL,
    },
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: [2, 'Минимальная длина поля - 2 символа'],
    maxlength: [30, 'Максимальная длина поля - 30 символов'],
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnAuthorizedError(Message.UNAUTHORIZED);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnAuthorizedError(Message.UNAUTHORIZED);
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
