import MainMenu from '../views/mainMenu';
import MovingControl from './modules/movingControl';
import Game from '../models/game';

interface Listen extends Event{
  which: Number;
}

class PlayerController {
  mainMenu: any;

  game: any;

  movingControl: any;

  constructor() {
    this.mainMenu = new MainMenu();
    this.game = Game.createScene();
    Game.generateWorld(this.game);
    this.movingControl = new MovingControl(this.game);
  }

  createKeyboardControls() {
    document.addEventListener('keydown', this.initEvents);
  }

  initEvents(event: Listen) {
    const { which } = event;

    switch (which) {
      case 87: {
        this.movingControl.moveForward();
        break;
      }
      case 65: {
        this.movingControl.moveLeft();
        break;
      }
      case 83: {
        this.movingControl.moveBackward();
        break;
      }
      case 68: {
        this.movingControl.moveRight();
        break;
      }
      default: break;
    }
  }
}

export default PlayerController;
