require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');

const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const responseError = require('./middlewares/response');

const mainRouter = require('./routes/index');

const { dbAdress, port } = require('./utils/config');

const { PORT = port, MONGO_URL, NODE_ENV } = process.env;
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect((NODE_ENV === 'production' ? MONGO_URL : dbAdress), {
  useNewUrlParser: true,
});

app.use(cors());
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);

app.use(mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(responseError);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту и работает в штатном режиме`);
});
