require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const limiter = require('./middlewares/limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const responseError = require('./middlewares/response');

const mainRouter = require('./routes/index');

const { PORT, MONGO_URL, NODE_ENV } = process.env;
const app = express();

mongoose.set('strictQuery', false);
mongoose.connect((NODE_ENV === 'production' ? MONGO_URL : 'mongodb://127.0.0.1:27017/bitfilmsdb'), {
  useNewUrlParser: true,
});

app.use(cors());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);
app.use(limiter);

app.use(mainRouter);

app.use(errorLogger);
app.use(errors());
app.use(responseError);

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${PORT} порту и работает в штатном режиме`);
});
