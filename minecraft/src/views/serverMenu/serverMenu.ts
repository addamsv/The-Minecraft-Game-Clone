import languageConfig from '../../configs/languageConfig';
import MainControllerInterface from '../../controllers/mainControllerInterface';
import MainModelInterface from '../../models/mainModelInterface';
import ViewsInterface from '../viewsInterface';

class ServerMenu implements ViewsInterface {
  private controller: MainControllerInterface;

  private model: MainModelInterface;

  private serverScreen: HTMLDivElement;

  private nickname: HTMLInputElement;

  private password: HTMLInputElement;

  private errorMessage: HTMLDivElement;

  private play: HTMLButtonElement;

  private logOut: HTMLButtonElement;

  private logIn: HTMLButtonElement;

  private or: HTMLSpanElement;

  private signUp: HTMLButtonElement;

  private serverWrapper: HTMLDivElement

  private buttonsWrapper: HTMLDivElement

  private backToMainMenu: HTMLButtonElement;

  private parseMessage: string;

  private failMessage: string;

  private readInputs: any;

  private checkStrings: any;

  private tokenLogin: any;

  private logOutFn: any;

  private closeServerMenu: any;

  constructor(controller: MainControllerInterface, model: MainModelInterface) {
    this.controller = controller;
    this.model = model;

    this.serverScreen = document.createElement('div');
    this.serverWrapper = document.createElement('div');
    this.nickname = document.createElement('input');
    this.password = document.createElement('input');
    this.password.type = 'password';
    this.errorMessage = document.createElement('div');
    this.buttonsWrapper = document.createElement('div');
    this.logOut = document.createElement('button');
    this.play = document.createElement('button');
    this.logIn = document.createElement('button');
    this.or = document.createElement('span');
    this.signUp = document.createElement('button');
    this.backToMainMenu = document.createElement('button');

    this.serverScreen.classList.add('server-screen');
    this.serverScreen.id = 'server-menu-id';
    this.serverWrapper.classList.add('server-wrapper');
    this.nickname.classList.add('nickname');
    this.password.classList.add('password');
    this.errorMessage.classList.add('error-message');
    this.buttonsWrapper.classList.add('buttons-wrapper');
    this.logOut.classList.add('server-btn');
    this.logOut.id = 'logOut';
    this.play.classList.add('server-btn');
    this.play.id = 'play';
    this.logIn.classList.add('server-btn');
    this.logIn.id = 'login';
    this.or.classList.add('or');
    this.signUp.classList.add('server-btn');
    this.signUp.id = 'signup';
    this.backToMainMenu.classList.add('server-btn', 'back-to-main-menu');

    this.createMenu();
  }

  public attachMenu() {
    document.body.append(this.serverScreen);
    this.addEventListeners();
  }

  public removeMenu() {
    this.serverScreen.remove();
    this.removeEventListeners();
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
    this.logOut.textContent = languageData.logOut;
    this.play.textContent = languageData.play;
    this.logIn.textContent = languageData.logIn;
    this.or.textContent = languageData.or;
    this.signUp.textContent = languageData.signUp;
    this.backToMainMenu.textContent = languageData.backToMainMenu;
    this.parseMessage = languageData.parseMessage;
    this.failMessage = languageData.failMessage;
    this.errorMessage.textContent = '';
  }

  private createMenu() {
    const USER_TOKEN = localStorage.getItem('USER_TOKEN');

    if (USER_TOKEN) {
      this.buttonsWrapperLoggedInType();
    } else {
      this.buttonsWrapper.append(this.logIn, this.or, this.signUp);
      this.serverWrapper.append(
        this.nickname,
        this.password,
        this.errorMessage,
        this.buttonsWrapper,
        this.backToMainMenu,
      );
    }

    this.serverScreen.append(this.serverWrapper);

    this.readInputs = this.readViewInputs.bind(this);
    this.checkStrings = this.model.loginThroughPassword.bind(this.model);
    this.tokenLogin = this.model.loginThroughToken.bind(this.model);
    this.logOutFn = this.model.logOut.bind(this.model);
    this.closeServerMenu = this.controller.closeServerMenu.bind(this.controller);
    this.getChanges();
  }

  private buttonsWrapperLoggedInType() {
    this.buttonsWrapper.append(this.play, this.or, this.logOut);
    this.serverWrapper.append(
      this.buttonsWrapper,
      this.errorMessage,
      this.backToMainMenu,
    );
  }

  private getChanges() {
    this.serverScreen.addEventListener('input-error', () => {
      this.errorMessage.textContent = this.parseMessage;
    });
    this.serverScreen.addEventListener('success', (event: CustomEvent) => {
      this.serverWrapper.innerHTML = '';
      this.buttonsWrapper.innerHTML = '';
      this.buttonsWrapperLoggedInType();
      this.errorMessage.textContent = `You are Registered as "${event.detail.login}"`;
      this.removeMenu();
    });
    this.serverScreen.addEventListener('fail', (event: CustomEvent) => {
      // this.errorMessage.textContent = this.failMessage;
      this.errorMessage.textContent = `fail: ${event.detail.fail}`;
    });
    this.serverScreen.addEventListener('logOut', () => {
      this.play.remove();
      this.logOut.remove();
      this.createMenu();
      this.errorMessage.textContent = 'logged-Out';
    });
  }

  private readViewInputs(event: any) {
    this.checkStrings(this.nickname.value, this.password.value, event.target.id);
  }

  private addEventListeners() {
    this.play.addEventListener('click', this.tokenLogin);
    this.logOut.addEventListener('click', this.logOutFn);
    this.logIn.addEventListener('click', this.readInputs);
    this.signUp.addEventListener('click', this.readInputs);
    this.backToMainMenu.addEventListener('click', this.closeServerMenu);
  }

  private removeEventListeners() {
    this.play.removeEventListener('click', this.tokenLogin);
    this.logOut.removeEventListener('click', this.logOutFn);
    this.logIn.removeEventListener('click', this.readViewInputs);
    this.signUp.removeEventListener('click', this.readViewInputs);
    this.backToMainMenu.removeEventListener('click', this.closeServerMenu);
  }
}

export default ServerMenu;
