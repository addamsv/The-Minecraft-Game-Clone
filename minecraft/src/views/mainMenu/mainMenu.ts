import ViewsInterface from '../viewsInterface';
import MainControllerInterface from '../../controllers/mainControllerInterface';
import languageConfig from '../../configs/languageConfig';

class MainMenu implements ViewsInterface {
  private controller: MainControllerInterface;

  private mainMenuScreen: HTMLDivElement;

  private playBtn: HTMLButtonElement;

  private serverBtn: HTMLButtonElement;

  private settingsBtn: HTMLButtonElement;

  private quitBtn: HTMLButtonElement;

  private startGame: any;

  private openServerMenu: any;

  private openSettingsMenu: any;

  private openQuitConfirm: any;

  constructor(controller: MainControllerInterface) {
    this.controller = controller;
    this.createMenu();
  }

  public attachMenu() {
    document.body.append(this.mainMenuScreen);
    this.addEventListeners();
  }

  public removeMenu() {
    this.mainMenuScreen.remove();
    this.removeEventListeners();
  }

  public addTextContent(language: string) {
    let languageData;
    switch (language) {
      case 'en': languageData = languageConfig.en.mainMenu; break;
      case 'ru': languageData = languageConfig.ru.mainMenu; break;
      default: break;
    }
    this.playBtn.textContent = languageData.playBtn;
    this.serverBtn.textContent = languageData.serverBtn;
    this.settingsBtn.textContent = languageData.settingsBtn;
    this.quitBtn.textContent = languageData.quitBtn;
  }

  private createMenu() {
    this.mainMenuScreen = document.createElement('div');
    const btnsWrapper = document.createElement('div');
    this.playBtn = document.createElement('button');
    this.serverBtn = document.createElement('button');
    this.settingsBtn = document.createElement('button');
    this.quitBtn = document.createElement('button');

    this.mainMenuScreen.classList.add('main-menu-screen');
    btnsWrapper.classList.add('btns-wrapper');
    this.playBtn.classList.add('main-menu-btn', 'play-btn');
    this.serverBtn.classList.add('main-menu-btn', 'server-btn');
    this.settingsBtn.classList.add('main-menu-btn', 'settings-btn');
    this.quitBtn.classList.add('main-menu-btn', 'quit-btn');

    btnsWrapper.append(this.playBtn, this.serverBtn, this.settingsBtn, this.quitBtn);
    this.mainMenuScreen.append(btnsWrapper);

    this.startGame = this.controller.startGame.bind(this.controller);
    this.openServerMenu = this.controller.openServerMenu.bind(this.controller);
    this.openSettingsMenu = this.controller.openSettingsMenu.bind(this.controller);
    this.openQuitConfirm = this.controller.openQuitConfirm.bind(this.controller);
  }

  private addEventListeners() {
    this.playBtn.addEventListener('click', this.startGame);
    this.serverBtn.addEventListener('click', this.openServerMenu);
    this.settingsBtn.addEventListener('click', this.openSettingsMenu);
    this.quitBtn.addEventListener('click', this.openQuitConfirm);
  }

  private removeEventListeners() {
    this.playBtn.removeEventListener('click', this.startGame);
    this.serverBtn.removeEventListener('click', this.openServerMenu);
    this.settingsBtn.removeEventListener('click', this.openSettingsMenu);
    this.quitBtn.removeEventListener('click', this.openQuitConfirm);
  }
}

export default MainMenu;
