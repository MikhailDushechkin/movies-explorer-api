const mongoose = require('mongoose');

const Movie = require('../models/movie');

const { ValidationError, CastError } = mongoose.Error;

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const { CodeSuccess, Message } = require('../utils/constants');

const addMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.status(CodeSuccess.CREATED).send(movie))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(Message.BAD_REQUEST));
        return;
      }
      next(err);
    });
};

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.status(CodeSuccess.OK).send(movies))
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError(Message.MOVIE_NOT_FOUND))
    .then((movie) => {
      if (movie.owner.equals(req.user._id)) {
        throw new ForbiddenError(Message.MOVIE_FORBIDDEN);
      }
      return Movie.deleteOne(req.params.movieId);
    })
    .then((movie) => {
      res.status(200).send(movie);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError(Message.BAD_REQUEST));
        return;
      }
      next(err);
    });
};

module.exports = {
  addMovie,
  getMovies,
  deleteMovie,
};
