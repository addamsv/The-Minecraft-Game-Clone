class MainMenu {
  mainMenuScreen: HTMLDivElement;

  playBtn: HTMLButtonElement;

  settingsBtn: HTMLButtonElement;

  quitBtn: HTMLButtonElement;

  constructor() {
    this.mainMenuScreen = document.createElement('div');
    const btnsWrapper = document.createElement('div');
    this.playBtn = document.createElement('button');
    this.settingsBtn = document.createElement('button');
    this.quitBtn = document.createElement('button');

    this.playBtn.textContent = 'Play game';
    this.settingsBtn.textContent = 'Settings';
    this.quitBtn.textContent = 'Quit game';

    this.mainMenuScreen.classList.add('main-menu-screen');
    btnsWrapper.classList.add('btns-wrapper');
    this.playBtn.classList.add('main-menu-btn', 'play-btn');
    this.settingsBtn.classList.add('main-menu-btn', 'settings-btn');
    this.quitBtn.classList.add('main-menu-btn', 'quit-btn');

    btnsWrapper.append(this.playBtn, this.settingsBtn, this.quitBtn);
    this.mainMenuScreen.appendChild(btnsWrapper);
    document.body.appendChild(this.mainMenuScreen);
  }

  toggleMainMenu() {
    this.mainMenuScreen.classList.toggle('hide');
  }
}

export default MainMenu;
