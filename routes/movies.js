const moviesRouter = require('express').Router();

const { addMovie, getMovies, deleteMovie } = require('../controllers/movies');
const { idValidation, movieValidation } = require('../middlewares/validate');

moviesRouter.get('/', getMovies);
moviesRouter.post('/', movieValidation, addMovie);
moviesRouter.delete('/:_id', idValidation, deleteMovie);

module.exports = moviesRouter;
