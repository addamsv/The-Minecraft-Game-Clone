import {
  createScene,
  generateWorld,
} from '../views/world';

interface listen extends Event{
  which: Number;
}

class PlayerController {
  GAME: any;

  world: Object;

  constructor() {
    this.GAME = createScene();
    generateWorld(this.GAME);
  }

  createKeyboardControls() {
    document.addEventListener('keydown', this.movePlayer);
  }

  movePlayer(event: listen) {
    const { which } = event;

    if (which === 87 || which === 65 || which === 83 || which === 68) {
      console.log(event);
      this.world = null;
    }
  }
}

export default PlayerController;
