// import MainModelInterface from '../../models/mainModelInterface';

class MainMenu {
  mainMenuScreen: HTMLDivElement;

  playBtn: HTMLButtonElement;

  settingsBtn: HTMLButtonElement;

  quitBtn: HTMLButtonElement;

  // input: HTMLInputElement;

  // /* password temporary */
  // password: HTMLInputElement;

  // inputBtn: HTMLButtonElement;

  // model: MainModelInterface;

  constructor() {
    // model: MainModelInterface) {
    // this.model = model;
    // this.model.auth('serega', '123');

    this.mainMenuScreen = document.createElement('div');
    const btnsWrapper = document.createElement('div');
    // const inputWrapper = document.createElement('div');
    // this.input = document.createElement('input');
    // /* password temporary */
    // this.password = document.createElement('input');
    // this.inputBtn = document.createElement('button');
    this.playBtn = document.createElement('button');
    this.settingsBtn = document.createElement('button');
    this.quitBtn = document.createElement('button');

    // this.input.placeholder = 'Input your name here';
    /* password temporary */
    // this.password.placeholder = 'Password Here';

    // this.inputBtn.textContent = 'Sent';
    this.playBtn.textContent = 'Play game';
    this.settingsBtn.textContent = 'Settings';
    this.quitBtn.textContent = 'Quit game';

    this.mainMenuScreen.classList.add('main-menu-screen');
    btnsWrapper.classList.add('btns-wrapper');
    // inputWrapper.classList.add('input-wrapper');
    // this.input.classList.add('input');
    /* password password temporary */
    // this.password.classList.add('input');
    // this.inputBtn.classList.add('input-btn');
    this.playBtn.classList.add('main-menu-btn', 'play-btn');
    this.settingsBtn.classList.add('main-menu-btn', 'settings-btn');
    this.quitBtn.classList.add('main-menu-btn', 'quit-btn');
    // inputWrapper.append(this.input, this.inputBtn);
    /* password temporary */
    // btnsWrapper.append(this.password);
    btnsWrapper.append(this.playBtn, this.settingsBtn, this.quitBtn);
    this.mainMenuScreen.appendChild(btnsWrapper);
    document.body.appendChild(this.mainMenuScreen);
  }

  toggleMainMenu() {
    this.mainMenuScreen.classList.toggle('hide');
  }
}

export default MainMenu;
