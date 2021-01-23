import { MainModelInterface, MainModel } from '../models/mainModel';
import MainControllerInterface from './mainControllerInterface';
import MenuView from '../views/menuView';
import GameModel from '../models/gameModel';

interface PlayerEvent extends Event {
  which: number;
}

class MainController implements MainControllerInterface {
  menuView: MenuView;

  gameModel: GameModel;

  isGameStart: boolean;

  isGamePause: boolean;

  isOpenChat: boolean;

  model: MainModelInterface;

  constructor() {
    this.model = new MainModel(this);
    this.isGameStart = false; // should be within the model (isGameStart) - state;
    this.isGamePause = true;
    this.isOpenChat = false;
    this.menuView = new MenuView(this, this.model);
    this.gameModel = new GameModel(this.model);
    this.prepareToStartGame();
  }

  startGame() {
    if (!this.isGameStart) {
      const seed = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      this.gameModel.generateWorld(seed);
      this.createKeyboardControls();
      document.body.appendChild(this.gameModel.stats.dom);
      document.body.appendChild(this.gameModel.renderer.domElement);
      this.gameModel.animationFrame();
      this.isGameStart = true;
    }
    this.gameModel.control.lock();
  }

  openServerMenu() {
    this.menuView.mainMenu.removeMenu();
    this.menuView.serverMenu.attachMenu();
  }

  closeServerMenu() {
    this.menuView.serverMenu.removeMenu();
    this.menuView.mainMenu.attachMenu();
  }

  openSettingsMenu() {
    this.menuView.mainMenu.removeMenu();
    this.menuView.settingsMenu.attachMenu();
  }

  changeCameraSettings(far: number, fov: number) {
    this.gameModel.camera.far = Number(far);
    this.gameModel.camera.fov = Number(fov);
    this.gameModel.camera.updateProjectionMatrix();
  }

  closeSettingsMenu() {
    this.menuView.settingsMenu.removeMenu();
    this.menuView.mainMenu.attachMenu();
  }

  openQuitConfirm() {
    this.menuView.mainMenu.removeMenu();
    this.menuView.quitConfirm.attachMenu();
  }

  // eslint-disable-next-line
  quitGame() {
    window.close();
  }

  closeQuitConfirm() {
    this.menuView.quitConfirm.removeMenu();
    this.menuView.mainMenu.attachMenu();
  }

  setChatStatus(message: string) {
    this.isOpenChat = !this.isOpenChat;
    if (this.isOpenChat) {
      this.gameModel.control.unlock();
      this.menuView.chatView.attachMenu();
    } else {
      this.gameModel.control.lock();
      this.menuView.chatView.removeMenu();
      const socket = this.model.getSocket();
      socket.sendMessage(message, 'chatMessage');
    }
  }

  getChatView() {
    return this.menuView.chatView;
  }

  prepareToStartGame() {
    this.gameModel.setGameView(this.menuView.gameView);

    // pointerLock API controls
    const controls = this.gameModel.control;
    controls.addEventListener('lock', () => {
      if (this.isGamePause) {
        this.menuView.mainMenu.removeMenu();
        this.menuView.chatView.connect();
        this.menuView.gameView.attachView();
      }
      this.isGamePause = false;
    });
    controls.addEventListener('unlock', () => {
      if (!this.isOpenChat) {
        this.isGamePause = true;
        this.menuView.mainMenu.attachMenu();
        this.menuView.chatView.disconnect();
        this.menuView.gameView.removeView();
      }
    });

    // multiplayer controls
    document.body.addEventListener('startservergame', () => {
      const seed = this.model.getSeed();
      if (!this.isGameStart) {
        this.gameModel.generateWorld(seed);
        this.createKeyboardControls();
        document.body.appendChild(this.gameModel.stats.dom);
        document.body.appendChild(this.gameModel.renderer.domElement);
        this.gameModel.animationFrame();
        this.isGameStart = true;
      }
      controls.lock();
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

  playerControls(event: any) {
    switch (event.which) {
      case 49: {
        this.gameModel.changeLanternStatus();
        break;
      }
      case 50: break;
      default: break;
    }
  }
}

export default MainController;
