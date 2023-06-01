const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const UnAuthorizedError = require('../errors/UnAuthorizedError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

// авторизация пользователя
const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnAuthorizedError('Неправильные email или password'));
      }
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );

      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      }).send({ token });
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        Promise.reject(new UnAuthorizedError('Неправильные email или password'));
        return;
      }
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      next(err);
    });
};

// выход из системы
const logoutUser = (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выполнен выход из системы' });
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
    .then((user) => res.status(201).send({
      name: user.name,
      _id: user._id,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.code === 11000) {
        next(new ConflictError('Такой пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

// получение конкретного пользователя
const getUserById = (req, res, next) => {
  User.findById(req.params._id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Некорректный запрос'));
        return;
      }
      next(err);
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
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports = {
  loginUser,
  logoutUser,
  createUser,
  getUserById,
  updateUserData,
};
