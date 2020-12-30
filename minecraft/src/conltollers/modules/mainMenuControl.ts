import MainMenuInterface from '../../interfaces/mainMenuInterface';
import { PointerLockControls } from './pointerLockControls.js';
import GameInterface from '../../interfaces/gameInterface';

interface Lock extends PointerLockControls {
  addEventListener?: Function,
}

class MainMenuControl {
  mainMenu: MainMenuInterface;

  game: GameInterface;

  constructor(mainMenu: MainMenuInterface, game: GameInterface) {
    this.mainMenu = mainMenu;
    this.game = game;
    this.startGame();
  }

  startGame() {
    const app = this.mainMenu.mainMenuScreen;
    const play = this.mainMenu.playBtn;

    const controls: Lock = new PointerLockControls(this.game.camera, document.body);
    this.game.control = controls;

    play.addEventListener('click', () => {
      controls.lock();
    }, false);

    controls.addEventListener('lock', () => {
      app.classList.toggle('lock');
    });

    controls.addEventListener('unlock', () => {
      app.classList.toggle('lock');
    });

    this.game.scene.add(controls.getObject());
  }
}

export default MainMenuControl;
