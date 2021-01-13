import { MainModelInterface, MainModel } from '../models/mainModel';
import MenuView from '../views/menuView';
import GameView from '../views/gameView';

interface CustomEvent extends Event {
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
    const play = this.menuView.mainMenu.playBtn;
    const server = this.menuView.mainMenu.serverBtn;
    const { login, password } = this.menuView.authForm;
    const register = this.menuView.authForm.sendBtn;

    server.addEventListener('click', () => {
      this.menuView.mainMenu.toggle();
      this.menuView.authForm.toggle();
    });

    register.addEventListener('click', () => {
      this.model.auth(login.value, password.value);
      this.menuView.authForm.toggle();
      // start server game here
    });

    const controls = this.gameView.control;

    play.addEventListener('click', () => {
      if (!this.gameStart) {
        this.createKeyboardControls();
        document.body.appendChild(this.gameView.stats.dom);
        document.body.appendChild(this.gameView.renderer.domElement);
        this.gameView.animationFrame();
        this.gameStart = true;
      }
      controls.lock();
    });

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
  }

  createKeyboardControls() {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  onKeyDown(event: CustomEvent) {
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

  onKeyUp(event: CustomEvent) {
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
