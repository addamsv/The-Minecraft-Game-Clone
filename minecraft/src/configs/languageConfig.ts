const languageConfig = {
  en: {
    chatView: {
      placeholder: 'Enter Message',
    },
    mainMenu: {
      playBtn: 'Play game',
      serverBtn: 'Join game',
      settingsBtn: 'Settings',
      quitBtn: 'Quit game',
    },
    quitConfirm: {
      confirmMessage: 'Are you sure?',
      yesBtn: 'Yes',
      noBtn: 'No',
    },
    serverMenu: {
      nickname: 'name',
      password: 'password',
      logIn: 'Log In',
      or: 'or',
      signUp: 'Sign Up',
      backToMainMenu: 'Cansel',
      parseMessage: 'use only a-z, A-Z and 0-9, the length should be between 3 and 12',
      failMessage: 'already in use',
    },
    settinsMenu: {
      langBtn: 'English',
      rangeLabel: 'distance: ',
      fovLabel: 'fov: ',
    },
  },
  ru: {
    chatView: {
      placeholder: 'Напишите сообщение',
    },
    mainMenu: {
      playBtn: 'Играть',
      serverBtn: 'Сетевая игра',
      settingsBtn: 'Настройки',
      quitBtn: 'Покинуть игру',
    },
    quitConfirm: {
      confirmMessage: 'Вы уверены?',
      yesBtn: 'Да',
      noBtn: 'Нет',
    },
    serverMenu: {
      nickname: 'имя',
      password: 'пароль',
      logIn: 'Войти',
      or: 'или',
      signUp: 'Зарегистрироваться',
      backToMainMenu: 'Отмена',
      parseMessage: 'используйте только a-z, A-Z и 0-9, длина должна быть от 3 до 12',
      failMessage: 'имя занято',
    },
    settinsMenu: {
      langBtn: 'Русский',
      rangeLabel: 'дальность видимости: ',
      fovLabel: 'угол обзора: ',
    },
  },
};

export default languageConfig;
