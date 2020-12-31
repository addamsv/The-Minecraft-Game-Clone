class MainMenu {
  mainMenuScreen: HTMLDivElement;

  playBtn: HTMLButtonElement;

  settingsBtn: HTMLButtonElement;

  quitBtn: HTMLButtonElement;

  input: HTMLInputElement;

  inputBtn: HTMLButtonElement;

  constructor() {
    this.mainMenuScreen = document.createElement('div');
    const btnsWrapper = document.createElement('div');
    const inputWrapper = document.createElement('div');
    this.input = document.createElement('input');
    this.inputBtn = document.createElement('button');
    this.playBtn = document.createElement('button');
    this.settingsBtn = document.createElement('button');
    this.quitBtn = document.createElement('button');

    this.input.placeholder = 'Input your name here';
    this.inputBtn.textContent = 'Sent';
    this.playBtn.textContent = 'Play game';
    this.settingsBtn.textContent = 'Settings';
    this.quitBtn.textContent = 'Quit game';

    this.mainMenuScreen.classList.add('main-menu-screen');
    btnsWrapper.classList.add('btns-wrapper');
    inputWrapper.classList.add('input-wrapper');
    this.input.classList.add('input');
    this.inputBtn.classList.add('input-btn');
    this.playBtn.classList.add('main-menu-btn', 'play-btn');
    this.settingsBtn.classList.add('main-menu-btn', 'settings-btn');
    this.quitBtn.classList.add('main-menu-btn', 'quit-btn');

    inputWrapper.append(this.input, this.inputBtn);
    btnsWrapper.append(inputWrapper, this.playBtn, this.settingsBtn, this.quitBtn);
    this.mainMenuScreen.appendChild(btnsWrapper);
    document.body.appendChild(this.mainMenuScreen);
  }
}

export default MainMenu;
