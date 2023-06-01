const usersRouter = require('express').Router();

const { getUserById, updateUserData } = require('../controllers/users');
const { userUpdateValidation } = require('../middlewares/validate');

usersRouter.get('/me', getUserById);
usersRouter.patch('/me', userUpdateValidation, updateUserData);

module.exports = usersRouter;
