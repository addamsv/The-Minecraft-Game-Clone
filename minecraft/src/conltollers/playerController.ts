import Game from '../models/game';
import MainMenu from '../views/mainMenu';
import MainMenuControl from './modules/mainMenuControl';
import KeysControl from './modules/keysControl';
import AnimationFrame from './modules/animationFrame';

class PlayerController {
  game: Game;

  mainMenu: MainMenu;

  mainMenuControl: MainMenuControl;

  keysControl: KeysControl;

  animationFrame: AnimationFrame;

  constructor() {
    this.game = new Game();
    this.game.createScene();
    this.game.generateWorld();

    this.mainMenu = new MainMenu();
    this.mainMenuControl = new MainMenuControl(this.mainMenu, this.game);

    this.keysControl = new KeysControl(this.game);
    this.keysControl.createKeyboardControls();

    this.animationFrame = new AnimationFrame(this.game);
  }
}

export default PlayerController;
