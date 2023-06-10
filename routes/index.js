const mainRouter = require('express').Router();

const moviesRouter = require('./movies');
const usersRouter = require('./users');

const { loginUser, logoutUser, createUser } = require('../controllers/users');
const { userValidation, userAuthValidation } = require('../middlewares/validate');
const auth = require('../middlewares/auth');

const NotFoundError = require('../errors/NotFoundError');
const { Message } = require('../utils/constants');

mainRouter.post('/signup', userValidation, createUser);
mainRouter.post('/signin', userAuthValidation, loginUser);
mainRouter.post('/signout', logoutUser);

mainRouter.use('/users', auth, usersRouter);
mainRouter.use('/movies', auth, moviesRouter);

mainRouter.use('*', auth, (req, res, next) => {
  next(new NotFoundError(Message.PAGE_NOT_FOUND));
});

module.exports = mainRouter;
