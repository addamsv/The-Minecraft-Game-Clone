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
      newPassword: 'new password',
      logOut: 'Log-Out',
      connect: 'Connect',
      logIn: 'Log In',
      changePassword: 'Change Password',
      sendNewPassword: 'Send Password',
      or: 'or',
      signUp: 'Sign Up',
      backToMainMenu: 'Cancel',
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
      newPassword: 'новый пароль',
      connect: 'Подключиться',
      logOut: 'Выйти из аккаунта',
      logIn: 'Войти',
      changePassword: 'Изменить Пароль',
      sendNewPassword: 'Отправить Пароль',
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
