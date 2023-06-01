const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    require: true,
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Ошибка при передаче ссылки на постер',
    },
  },
  trailerLink: {
    type: String,
    require: true,
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Ошибка при передаче ссылки на трейлер',
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Ошибка при передаче ссылки на миниатюрное изображение постера',
    },
  },
  owner: {
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    require: true,
  },
  nameEN: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
