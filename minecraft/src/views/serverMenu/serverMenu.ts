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

  private newPassword: HTMLInputElement;

  private errorMessage: HTMLDivElement;

  private play: HTMLButtonElement;

  private logOut: HTMLButtonElement;

  private disconnect: HTMLButtonElement;

  private logIn: HTMLButtonElement;

  private changePassword: HTMLButtonElement;

  private sendNewPassword: HTMLButtonElement;

  private or: HTMLSpanElement;

  private signUp: HTMLButtonElement;

  private serverWrapper: HTMLDivElement

  private buttonsWrapper: HTMLDivElement

  private backToMainMenu: HTMLButtonElement;

  private exitChangePassButton: HTMLButtonElement;

  private parseMessage: string;

  private failMessage: string;

  private readInputs: any;

  private readNewPasswordInput: any;

  private loginThroughPassword: any;

  private tokenLogin: any;

  private logOutFn: any;

  private disconnectFn: any;

  private changePasswordFn: any;

  private sendNewPasswordFn: any;

  private closeServerMenu: any;

  private exitChangePass: any;

  private languageData: any;

  private isListenersAdded: boolean;

  constructor(controller: MainControllerInterface, model: MainModelInterface) {
    this.controller = controller;
    this.model = model;

    this.serverScreen = document.createElement('div');
    this.serverWrapper = document.createElement('div');
    this.nickname = document.createElement('input');
    this.password = document.createElement('input');
    this.password.type = 'password';
    this.newPassword = document.createElement('input');
    this.newPassword.type = 'password';
    this.errorMessage = document.createElement('div');
    this.buttonsWrapper = document.createElement('div');
    this.logOut = document.createElement('button');
    this.disconnect = document.createElement('button');
    this.play = document.createElement('button');
    this.logIn = document.createElement('button');
    this.changePassword = document.createElement('button');
    this.sendNewPassword = document.createElement('button');
    this.or = document.createElement('span');
    this.signUp = document.createElement('button');
    this.backToMainMenu = document.createElement('button');
    this.exitChangePassButton = document.createElement('button');

    this.serverScreen.classList.add('server-screen');
    this.serverScreen.id = 'server-menu-id';
    this.serverWrapper.classList.add('server-wrapper', 'animated');
    this.nickname.classList.add('nickname');
    this.password.classList.add('password');
    this.newPassword.classList.add('password');
    this.errorMessage.classList.add('error-message');
    this.buttonsWrapper.classList.add('buttons-wrapper');
    this.logOut.classList.add('server-btn');
    this.logOut.id = 'logOut';
    this.disconnect.classList.add('server-btn');
    this.disconnect.id = 'disconnect';
    this.play.classList.add('server-btn');
    this.play.id = 'play';
    this.logIn.classList.add('server-btn');
    this.logIn.id = 'login';
    this.changePassword.classList.add('server-btn');
    this.changePassword.id = 'changePassword';
    this.sendNewPassword.classList.add('server-btn');
    this.sendNewPassword.id = 'sendNewPassword';
    this.or.classList.add('or');
    this.signUp.classList.add('server-btn');
    this.signUp.id = 'signup';
    this.backToMainMenu.classList.add('server-btn', 'back-to-main-menu');
    this.exitChangePassButton.classList.add('server-btn', 'back-to-main-menu');
    this.languageData = null;

    this.isListenersAdded = false;

    this.createMenu();
  }

  public showResponse(data: any) {
    if (data.statusCode === 200) {
      this.errorMessage.textContent = `${this.languageData.registeredAs} ${data.login}`;
    } else {
      this.errorMessage.textContent = this.languageData.userIsAlreadyRegistered;
    }
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
    // let languageData;
    switch (language) {
      case 'en': this.languageData = languageConfig.en.serverMenu; break;
      case 'ru': this.languageData = languageConfig.ru.serverMenu; break;
      default: break;
    }
    this.nickname.placeholder = this.languageData.nickname;
    this.password.placeholder = this.languageData.password;
    this.newPassword.placeholder = this.languageData.newPassword;
    this.logOut.textContent = this.languageData.logOut;
    this.disconnect.textContent = this.languageData.exitServerGame;
    this.play.textContent = this.languageData.connect;
    this.logIn.textContent = this.languageData.logIn;
    this.changePassword.textContent = this.languageData.changePassword;
    this.sendNewPassword.textContent = this.languageData.sendNewPassword;
    this.or.textContent = this.languageData.or;
    this.signUp.textContent = this.languageData.signUp;
    this.backToMainMenu.textContent = this.languageData.backToMainMenu;
    this.exitChangePassButton.textContent = this.languageData.backToMainMenu;
    this.parseMessage = this.languageData.parseMessage;
    this.failMessage = this.languageData.failMessage;
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
    this.readNewPasswordInput = this.readNewPasswordViewInput.bind(this);
    this.loginThroughPassword = this.model.loginThroughPassword.bind(this.model);
    this.tokenLogin = this.model.loginThroughToken.bind(this.model);
    this.logOutFn = this.controller.logOut.bind(this.controller);
    this.disconnectFn = this.controller.disconnect.bind(this.controller);
    this.changePasswordFn = this.model.changePassword.bind(this.model);
    this.sendNewPasswordFn = this.model.sendNewPassword.bind(this.model);
    this.closeServerMenu = this.controller.closeServerMenu.bind(this.controller);
    this.exitChangePass = this.model.exitChangePassMenu.bind(this.model);

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

  private buttonsWrapperJustLoggedInType() {
    this.buttonsWrapper.append(this.changePassword, this.or, this.disconnect);
    this.serverWrapper.append(
      this.buttonsWrapper,
      this.errorMessage,
      this.backToMainMenu,
    );
  }

  private getChanges() {
    if (this.isListenersAdded) {
      return;
    }
    this.isListenersAdded = true;
    // window || this.serverScreen
    document.addEventListener('input-error', () => {
      this.errorMessage.textContent = this.parseMessage;
    });
    document.addEventListener('success', (event: CustomEvent) => {
      this.successLogIn(event);
    });
    document.addEventListener('changePassword', () => {
      this.changePasswordFunc();
    });
    document.addEventListener('fail', (event: CustomEvent) => {
      this.errorMessage.textContent = `${this.languageData.fail}: ${this.languageData[event.detail.fail]}`;
    });
    document.addEventListener('mess', (event: CustomEvent) => {
      this.errorMessage.textContent = `${this.languageData[event.detail.mess]}`;
    });
    document.addEventListener('logOut', () => {
      this.logOutGame();
    });
    document.addEventListener('disconnect', () => {
      console.log('exitServerGame');
      this.exitServerGame();
    });
    document.addEventListener('makeChangePasswordMenu', () => {
      this.makeChangePasswordMenu();
    });
    document.addEventListener('exitChangePassMenu', () => {
      this.exitChangePassMenu();
    });
  }

  private successLogIn(event: CustomEvent) {
    this.serverWrapper.innerHTML = '';
    this.buttonsWrapper.innerHTML = '';
    this.buttonsWrapperJustLoggedInType();
    this.errorMessage.textContent = `${this.languageData.registeredAs} "${event.detail.login}"`;
    this.removeMenu();
  }

  private changePasswordFunc() {
    this.serverWrapper.innerHTML = '';
    this.buttonsWrapper.innerHTML = '';
    this.buttonsWrapperJustLoggedInType();
    this.errorMessage.textContent = this.languageData.passChanged;
  }

  private logOutGame() {
    this.changePassword.remove();
    this.play.remove();
    this.logOut.remove();
    this.createMenu();
    this.errorMessage.textContent = this.languageData.loggedOut;
  }

  private exitServerGame() {
    this.changePassword.remove();
    this.play.remove();
    this.disconnect.remove();
    this.createMenu();
    this.errorMessage.textContent = this.languageData.loggedOut;
  }

  private makeChangePasswordMenu() {
    this.disconnect.remove();
    this.or.remove();
    this.changePassword.remove();
    this.backToMainMenu.remove();
    this.buttonsWrapper.append(this.sendNewPassword);
    this.serverWrapper.append(
      this.newPassword,
      this.buttonsWrapper,
      this.errorMessage,
      this.exitChangePassButton,
    );
    this.errorMessage.textContent = this.languageData.changePassRequest;
  }

  private exitChangePassMenu() {
    this.sendNewPassword.remove();
    this.exitChangePassButton.remove();
    this.newPassword.remove();
    this.buttonsWrapper.append(this.changePassword, this.or, this.disconnect);
    this.serverWrapper.append(
      this.buttonsWrapper,
      this.errorMessage,
      this.backToMainMenu,
    );
  }

  private readViewInputs(event: any) {
    this.loginThroughPassword(this.nickname.value, this.password.value, event.target.id);
  }

  private readNewPasswordViewInput(event: any) {
    this.sendNewPasswordFn(this.newPassword.value, event.target.id);
  }

  private addEventListeners() {
    this.removeEventListeners();
    this.play.addEventListener('click', this.tokenLogin);
    this.logOut.addEventListener('click', this.logOutFn);
    this.disconnect.addEventListener('click', this.disconnectFn);
    this.changePassword.addEventListener('click', this.changePasswordFn);
    this.sendNewPassword.addEventListener('click', this.readNewPasswordInput);
    this.logIn.addEventListener('click', this.readInputs);
    this.signUp.addEventListener('click', this.readInputs);
    this.backToMainMenu.addEventListener('click', this.closeServerMenu);
    this.exitChangePassButton.addEventListener('click', this.exitChangePass);
  }

  private removeEventListeners() {
    this.play.removeEventListener('click', this.tokenLogin);
    this.logOut.removeEventListener('click', this.logOutFn);
    this.disconnect.removeEventListener('click', this.disconnectFn);
    this.changePassword.removeEventListener('click', this.changePasswordFn);
    this.sendNewPassword.removeEventListener('click', this.readNewPasswordInput);
    this.logIn.removeEventListener('click', this.readViewInputs);
    this.signUp.removeEventListener('click', this.readViewInputs);
    this.backToMainMenu.removeEventListener('click', this.closeServerMenu);
    this.exitChangePassButton.removeEventListener('click', this.exitChangePass);
  }
}

export default ServerMenu;
