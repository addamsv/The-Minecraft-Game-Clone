import languageConfig from '../../configs/languageConfig';

class ServerMenu {
  serverScreen: HTMLDivElement;

  nickname: HTMLInputElement;

  password: HTMLInputElement;

  errorMessage: HTMLDivElement;

  logIn: HTMLButtonElement;

  or: HTMLSpanElement;

  signUp: HTMLButtonElement;

  backToMainMenu: HTMLButtonElement;

  parseMessage: string;

  failMessage: string;

  constructor() {
    this.createMenu();
    this.getChanges();
  }

  public addTextContent(language: string) {
    let languageData;
    switch (language) {
      case 'en': languageData = languageConfig.en.serverMenu; break;
      case 'ru': languageData = languageConfig.ru.serverMenu; break;
      default: break;
    }
    this.nickname.placeholder = languageData.nickname;
    this.password.placeholder = languageData.password;
    this.logIn.textContent = languageData.logIn;
    this.or.textContent = languageData.or;
    this.signUp.textContent = languageData.signUp;
    this.backToMainMenu.textContent = languageData.backToMainMenu;
    this.parseMessage = languageData.parseMessage;
    this.failMessage = languageData.failMessage;
    this.errorMessage.textContent = '';
  }

  public toggle() {
    this.serverScreen.classList.toggle('hide');
  }

  private createMenu() {
    this.serverScreen = document.createElement('div');
    const serverWrapper = document.createElement('div');
    this.nickname = document.createElement('input');
    this.password = document.createElement('input');
    this.errorMessage = document.createElement('div');
    const buttonsWrapper = document.createElement('div');
    this.logIn = document.createElement('button');
    this.or = document.createElement('span');
    this.signUp = document.createElement('button');
    this.backToMainMenu = document.createElement('button');

    this.serverScreen.classList.add('server-screen', 'hide');
    this.serverScreen.id = 'server-menu-id';
    serverWrapper.classList.add('server-wrapper');
    this.nickname.classList.add('nickname');
    this.password.classList.add('password');
    this.errorMessage.classList.add('error-message');
    buttonsWrapper.classList.add('buttons-wrapper');
    this.logIn.classList.add('server-btn');
    this.or.classList.add('or');
    this.signUp.classList.add('server-btn');
    this.backToMainMenu.classList.add('server-btn', 'back-to-main-menu');

    buttonsWrapper.append(this.logIn, this.or, this.signUp);
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

  private getChanges() {
    this.serverScreen.addEventListener('input-error', () => {
      this.errorMessage.textContent = this.parseMessage;
    });
    this.serverScreen.addEventListener('success', () => {
      this.successEnter();
    });
    this.serverScreen.addEventListener('fail', () => {
      this.errorMessage.textContent = this.failMessage;
    });
  }

  private successEnter() {
    this.toggle();
    const event = new CustomEvent('startservergame');
    document.body.dispatchEvent(event);
  }
}

export default ServerMenu;
