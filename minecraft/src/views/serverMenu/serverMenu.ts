class ServerMenu {
  serverScreen: HTMLDivElement;

  nickname: HTMLInputElement;

  password: HTMLInputElement;

  errorMessage: HTMLDivElement;

  logIn: HTMLButtonElement;

  signUp: HTMLButtonElement;

  backToMainMenu: HTMLButtonElement;

  constructor() {
    this.createMenu();
    this.getChanges();
  }

  createMenu() {
    this.serverScreen = document.createElement('div');
    const serverWrapper = document.createElement('div');
    this.nickname = document.createElement('input');
    this.password = document.createElement('input');
    this.errorMessage = document.createElement('div');
    const buttonsWrapper = document.createElement('div');
    this.logIn = document.createElement('button');
    const or = document.createElement('span');
    this.signUp = document.createElement('button');
    this.backToMainMenu = document.createElement('button');

    this.serverScreen.classList.add('server-screen', 'hide');
    serverWrapper.classList.add('server-wrapper');
    this.nickname.classList.add('nickname');
    this.password.classList.add('password');
    this.errorMessage.classList.add('error-message');
    buttonsWrapper.classList.add('buttons-wrapper');
    this.logIn.classList.add('server-btn');
    or.classList.add('or');
    this.signUp.classList.add('server-btn');
    this.backToMainMenu.classList.add('server-btn', 'back-to-main-menu');

    this.nickname.placeholder = 'name';
    this.password.placeholder = 'password';
    this.logIn.textContent = 'Log In';
    or.textContent = 'or';
    this.signUp.textContent = 'Sign Up';
    this.backToMainMenu.textContent = 'Cansel';

    buttonsWrapper.append(this.logIn, or, this.signUp);
    serverWrapper.append(
      this.nickname,
      this.password,
      this.errorMessage,
      buttonsWrapper,
      this.backToMainMenu,
    );
    this.serverScreen.appendChild(serverWrapper);
    document.body.appendChild(this.serverScreen);
  }

  getChanges() {
    document.body.addEventListener('servermenu', () => {
      this.errorMessage.textContent = 'use only a-zA-Z and 0-9, length should be beetween 3 and 12';
    });
  }

  toggle() {
    this.serverScreen.classList.toggle('hide');
  }
}

export default ServerMenu;
