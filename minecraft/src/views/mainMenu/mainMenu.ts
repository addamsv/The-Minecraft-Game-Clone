import languageConfig from '../../configs/languageConfig';

class MainMenu {
  mainMenuScreen: HTMLDivElement;

  playBtn: HTMLButtonElement;

  serverBtn: HTMLButtonElement;

  settingsBtn: HTMLButtonElement;

  quitBtn: HTMLButtonElement;

  constructor() {
    this.createMenu();
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

  public toggle() {
    this.mainMenuScreen.classList.toggle('hide');
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

    this.mainMenuScreen.appendChild(btnsWrapper);
    document.body.appendChild(this.mainMenuScreen);
  }
}

export default MainMenu;
