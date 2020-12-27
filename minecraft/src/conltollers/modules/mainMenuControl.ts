import { PointerLockControls } from './pointerLockControls.js';
import GameInterface from '../../interfaces/gameInterface';

interface Lock extends PointerLockControls {
  addEventListener?: Function,
}

class MainMenuControl {
  game: GameInterface;

  constructor(game: GameInterface) {
    this.game = game;
    this.startGame();
  }

  startGame() {
    const app = document.getElementById('app');
    const play = document.getElementById('start');

    const controls: Lock = new PointerLockControls(this.game.camera, document.body);
    this.game.control = controls;

    play.addEventListener('click', () => {
      controls.lock();
    }, false);

    controls.addEventListener('lock', () => {
      play.classList.toggle('lock');
      app.classList.toggle('lock');
    });

    controls.addEventListener('unlock', () => {
      app.classList.toggle('lock');
      play.classList.toggle('lock');
    });

    this.game.scene.add(controls.getObject());
  }
}

export default MainMenuControl;
