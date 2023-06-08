const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const { jwtSecret, modeProduction } = require('../utils/config');

const { ValidationError, DocumentNotFoundError } = mongoose.Error;

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const { CodeSuccess, Message } = require('../utils/constants');

// авторизация пользователя
const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === modeProduction ? JWT_SECRET : jwtSecret,
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      });
      res.send({ message: Message.SUCCESS_AUTH });
    })
    .catch((err) => {
      next(err);
    });
};

// выход из системы
const logoutUser = (req, res) => {
  res.clearCookie('jwt').send({ message: Message.LOGOUT });
};

// регистрация пользователя
const createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.status(CodeSuccess.OK).send({
      name: user.name,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(Message.BAD_REQUEST));
      } else if (err.code === 11000) {
        next(new ConflictError(Message.USER_CONFLICT));
      } else {
        next(err);
      }
    });
};

// получение конкретного пользователя
const getUserById = (req, res, next) => {
  User.findById(req.params._id)
    .orFail()
    .then((user) => {
      res.status(CodeSuccess.OK).send(user);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError(Message.USER_NOT_FOUND));
      } else {
        next(err);
      }
    });
};

// обновление данных пользователя
const updateUserData = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.status(CodeSuccess.OK).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(Message.BAD_REQUEST));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError(Message.USER_NOT_FOUND));
      } else if (err.code === 11000) {
        next(new ConflictError(Message.USER_CONFLICT));
      } else {
        next(err);
      }
    });
};

module.exports = {
  loginUser,
  logoutUser,
  createUser,
  getUserById,
  updateUserData,
};
