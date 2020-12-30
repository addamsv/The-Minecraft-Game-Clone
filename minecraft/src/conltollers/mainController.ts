import MainMenuInterface from '../interfaces/mainMenuInterface';
import GameInterface from '../interfaces/gameInterface';

import MainMenuControl from './modules/mainMenuControl';
import KeysControl from './modules/keysControl';
import AnimationFrame from './modules/animationFrame';

class MainController {
  mainMenuControl: MainMenuControl;

  keysControl: KeysControl;

  animationFrame: AnimationFrame;

  constructor(view: MainMenuInterface, game: GameInterface) {
    game.createScene();
    game.generateWorld();
    this.mainMenuControl = new MainMenuControl(view, game);
    this.keysControl = new KeysControl(game);
    this.keysControl.createKeyboardControls();
    this.animationFrame = new AnimationFrame(game);
  }
}

export default MainController;
