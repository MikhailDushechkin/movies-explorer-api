const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Должна быть указана страна создания фильма'],
  },
  director: {
    type: String,
    required: [true, 'Должен быть указан режиссер фильма'],
  },
  duration: {
    type: Number,
    required: [true, 'Должна быть указана продолжительность фильма'],
  },
  year: {
    type: String,
    required: [true, 'Должен быть указан год фильма'],
  },
  description: {
    type: String,
    required: [true, 'Должно быть указано описание фильма'],
  },
  image: {
    type: String,
    required: [true, 'Должна быть указана ссылка на изображение фильма'],
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Ошибка при передаче ссылки на постер',
    },
  },
  trailerLink: {
    type: String,
    required: [true, 'Должна быть указана ссылка на трейлер фильма'],
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Ошибка при передаче ссылки на трейлер',
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Должна быть указана ссылка на постер фильма'],
    validate: {
      validator: (link) => validator.isURL(link),
      message: 'Ошибка при передаче ссылки на миниатюрное изображение постера',
    },
  },
  owner: {
    ref: 'user',
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Должен быть указан владелец поста с фильмом'],
  },
  movieId: {
    type: Number,
    required: [true, 'Должен быть указан ID фильма'],
  },
  nameRU: {
    type: String,
    required: [true, 'Должно быть указано название фильма на русском языке'],
  },
  nameEN: {
    type: String,
    required: [true, 'Должно быть указано название фильма на английском языке'],
  },
});

module.exports = mongoose.model('movie', movieSchema);
