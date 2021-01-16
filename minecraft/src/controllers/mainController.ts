import { MainModelInterface, MainModel } from '../models/mainModel';
import MenuView from '../views/menuView';
import GameView from '../models/gameModel';

interface PlayerEvent extends Event {
  which: number;
}

class MainController {
  menuView: MenuView;

  gameView: GameView;

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
    this.gameView = new GameView(this.model);
    this.prepareToStartGame();
  }

  prepareToStartGame() {
    // pointerLock API controls
    const controls = this.gameView.control;
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
        this.gameView.generateWorld();
        this.createKeyboardControls();
        document.body.appendChild(this.gameView.stats.dom);
        document.body.appendChild(this.gameView.renderer.domElement);
        this.gameView.animationFrame();
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
      this.model.checkStrings(nickname.value, password.value, 'logIn');
    });
    signUp.addEventListener('click', () => {
      this.model.checkStrings(nickname.value, password.value, 'signUp');
    });
    backToMainMenu.addEventListener('click', () => {
      this.menuView.mainMenu.toggle();
      this.menuView.serverMenu.toggle();
    });

    // settingsMenu controls
    const okButton = this.menuView.settingsMenu.okBtn;
    okButton.addEventListener('click', () => {
      this.menuView.mainMenu.toggle();
      this.menuView.settingsMenu.toggle();
    });
    document.body.addEventListener('camera', (event: CustomEvent) => {
      this.gameView.camera.far = Number(event.detail.far);
      this.gameView.camera.fov = Number(event.detail.fov);
      this.gameView.camera.updateProjectionMatrix();
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
      case 87: this.gameView.forward = true; break;
      case 65: this.gameView.left = true; break;
      case 83: this.gameView.backward = true; break;
      case 68: this.gameView.right = true; break;
      case 32: {
        if (this.gameView.jump === true) {
          this.gameView.speed.y += 150;
        }
        this.gameView.jump = false;
        break;
      }
      case 84: {
        this.openChat = !this.openChat;
        if (this.openChat) {
          this.gameView.control.unlock();
        } else {
          this.gameView.control.lock();
        }
        this.menuView.chat.toggle();
        break;
      }
      default: break;
    }
  }

  onKeyUp(event: PlayerEvent) {
    switch (event.which) {
      case 87: this.gameView.forward = false; break;
      case 65: this.gameView.left = false; break;
      case 83: this.gameView.backward = false; break;
      case 68: this.gameView.right = false; break;
      default: break;
    }
  }
}

export default MainController;
