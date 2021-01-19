import { MainModelInterface, MainModel } from '../models/mainModel';
import MenuView from '../views/menuView';
import GameModel from '../models/gameModel';

interface PlayerEvent extends Event {
  which: number;
}

class MainController {
  menuView: MenuView;

  gameModel: GameModel;

  gameStart: boolean;

  gamePause: boolean;

  openChat: boolean;

  model: MainModelInterface;

  constructor() {
    this.model = new MainModel();
    this.gameStart = false; // should be within the model (isGameStart) - state;
    this.gamePause = true;
    this.openChat = false;
    this.menuView = new MenuView(this.model);
    this.gameModel = new GameModel(this.model);
    this.prepareToStartGame();
  }

  prepareToStartGame() {
    // pointerLock API controls
    const controls = this.gameModel.control;
    controls.addEventListener('lock', () => {
      if (this.gamePause) {
        this.menuView.mainMenu.toggle();
      }
      this.gamePause = false;
    });
    controls.addEventListener('unlock', () => {
      if (!this.openChat) {
        this.gamePause = true;
        this.menuView.mainMenu.toggle();
      }
    });

    // mainMenu controls
    const {
      playBtn, serverBtn, settingsBtn, quitBtn,
    } = this.menuView.mainMenu;
    playBtn.addEventListener('click', () => {
      if (!this.gameStart) {
        this.gameModel.generateWorld();
        this.createKeyboardControls();
        document.body.appendChild(this.gameModel.stats.dom);
        document.body.appendChild(this.gameModel.renderer.domElement);
        this.gameModel.animationFrame();
        this.gameStart = true;
      }
      controls.lock();
    });
    serverBtn.addEventListener('click', () => {
      this.menuView.mainMenu.toggle();
      this.menuView.serverMenu.toggle();
    });
    settingsBtn.addEventListener('click', () => {
      this.menuView.mainMenu.toggle();
      this.menuView.settingsMenu.toggle();
    });

    // serverMenu controls
    const {
      nickname, password, logIn, signUp, backToMainMenu,
    } = this.menuView.serverMenu;
    logIn.addEventListener('click', () => {
      this.model.checkStrings(nickname.value, password.value, 'login');
    });
    signUp.addEventListener('click', () => {
      this.model.checkStrings(nickname.value, password.value, 'signup');
    });
    backToMainMenu.addEventListener('click', () => {
      this.menuView.mainMenu.toggle();
      this.menuView.serverMenu.toggle();
    });
    document.body.addEventListener('startservergame', () => {
      this.menuView.mainMenu.toggle();
      console.log('logged in');
      if (!this.gameStart) {
        this.gameModel.generateWorld();
        this.createKeyboardControls();
        document.body.appendChild(this.gameModel.stats.dom);
        document.body.appendChild(this.gameModel.renderer.domElement);
        this.gameModel.animationFrame();
        this.gameStart = true;
      }
      controls.lock();
    });

    // settingsMenu controls
    const { langBtn, okBtn } = this.menuView.settingsMenu;
    langBtn.addEventListener('click', () => {
      switch (langBtn.textContent) {
        case 'English': {
          this.menuView.setLanguage('ru');
          break;
        }
        case 'Русский': {
          this.menuView.setLanguage('en');
          break;
        }
        default: break;
      }
    });
    okBtn.addEventListener('click', () => {
      this.menuView.mainMenu.toggle();
      this.menuView.settingsMenu.toggle();
    });
    document.getElementById('settings-screen-id').addEventListener('camera', (event: CustomEvent) => {
      this.gameModel.camera.far = Number(event.detail.far);
      this.gameModel.camera.fov = Number(event.detail.fov);
      this.gameModel.camera.updateProjectionMatrix();
    });

    // quitGame controls
    const { yesBtn, noBtn } = this.menuView.quitConfirm;
    quitBtn.addEventListener('click', () => {
      this.menuView.quitConfirm.toggle();
      this.menuView.mainMenu.toggle();
    });
    yesBtn.addEventListener('click', () => {
      window.close();
    });
    noBtn.addEventListener('click', () => {
      this.menuView.quitConfirm.toggle();
      this.menuView.mainMenu.toggle();
    });
  }

  createKeyboardControls() {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  onKeyDown(event: PlayerEvent) {
    switch (event.which) {
      case 87: this.gameModel.forward = true; break;
      case 65: this.gameModel.left = true; break;
      case 83: this.gameModel.backward = true; break;
      case 68: this.gameModel.right = true; break;
      case 32: {
        if (this.gameModel.jump === true) {
          this.gameModel.speed.y += 150;
        }
        this.gameModel.jump = false;
        break;
      }
      case 84: {
        this.openChat = !this.openChat;
        if (this.openChat) {
          this.gameModel.control.unlock();
        } else {
          this.gameModel.control.lock();
        }
        this.menuView.chat.toggle();
        break;
      }
      default: break;
    }
  }

  onKeyUp(event: PlayerEvent) {
    switch (event.which) {
      case 87: this.gameModel.forward = false; break;
      case 65: this.gameModel.left = false; break;
      case 83: this.gameModel.backward = false; break;
      case 68: this.gameModel.right = false; break;
      default: break;
    }
  }
}

export default MainController;
