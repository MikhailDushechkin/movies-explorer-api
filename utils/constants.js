const CodeError = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  ALREADY_EXISTS: 409,
  SERVER_ERROR: 500,
};

const CodeSuccess = {
  OK: 200,
  CREATED: 201,
};

const Message = {
  UNAUTHORIZED: 'Неправильные email или password',
  BAD_REQUEST: 'Переданы некорректные данные',
  PAGE_NOT_FOUND: 'Страница не найдена',
  SERVER_ERROR: 'На сервере произошла ошибка',
  LOGOUT: 'Выполнен выход из системы',
  MOVIE_NOT_FOUND: 'Фильм с указанным id не найден',
  MOVIE_FORBIDDEN: 'Удаление чужого фильма невозможно',
  BAD_EMAIL: 'Некорректный адрес электронной почты',
  USER_CONFLICT: 'Такой пользователь уже существует',
  USER_NOT_FOUND: 'Пользователь не найден',
  SUCCESS_AUTH: 'Авторизация прошла успешно',
  BAD_AUTH: 'Необходимо авторизироваться',
};

module.exports = {
  CodeError,
  CodeSuccess,
  Message,
};
