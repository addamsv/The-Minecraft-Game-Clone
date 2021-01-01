import MenuView from '../views/menuView';
import GameView from '../views/gameView';
import { PointerLockControls } from './modules/pointerLockControls.js';

interface Lock extends PointerLockControls {
  addEventListener?: Function,
}

interface CustomEvent extends Event {
  which: number;
}

class MainController {
  menuView: MenuView;

  gameView: GameView;

  gameStart: boolean;

  constructor() {
    this.menuView = new MenuView();
    this.gameStart = false;
    this.gameView = new GameView();
    this.gameView.createScene();
    this.prepareToStartGame();
  }

  prepareToStartGame() {
    const app = this.menuView.mainMenu.mainMenuScreen;
    const play = this.menuView.mainMenu.playBtn;

    const controls: Lock = new PointerLockControls(this.gameView.camera, document.body);
    this.gameView.control = controls;

    play.addEventListener('click', () => {
      if (!this.gameStart) {
        this.createKeyboardControls();
        this.gameView.generateWorld();
        document.body.appendChild(this.gameView.renderer.domElement);
        this.gameView.animationFrame();
        this.gameStart = true;
      }
      controls.lock();
    });

    controls.addEventListener('lock', () => {
      app.classList.toggle('lock');
    });

    controls.addEventListener('unlock', () => {
      app.classList.toggle('lock');
    });

    this.gameView.scene.add(controls.getObject());
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
