import GameInterface from '../../interfaces/gameInterface';
import CustomEvent from '../../interfaces/customEvent';

class KeysControl {
  game: GameInterface;

  constructor(game: GameInterface) {
    this.game = game;
    this.game.forward = false;
    this.game.left = false;
    this.game.backward = false;
    this.game.right = false;
    this.game.jump = false;
  }

  createKeyboardControls() {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  onKeyDown(event: CustomEvent) {
    switch (event.which) {
      case 87: this.game.forward = true; break;
      case 65: this.game.left = true; break;
      case 83: this.game.backward = true; break;
      case 68: this.game.right = true; break;
      case 32: {
        if (this.game.jump === true) {
          this.game.speed.y += 200;
        }
        this.game.jump = false;
        break;
      }
      default: break;
    }
  }

  onKeyUp(event: CustomEvent) {
    switch (event.which) {
      case 87: this.game.forward = false; break;
      case 65: this.game.left = false; break;
      case 83: this.game.backward = false; break;
      case 68: this.game.right = false; break;
      default: break;
    }
  }
}

export default KeysControl;
