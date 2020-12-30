import GameInterface from '../interfaces/gameInterface';

import MainView from '../views/mainView';
import MainMenuControl from './modules/mainMenuControl';
import KeysControl from './modules/keysControl';
import AnimationFrame from './modules/animationFrame';

class MainController {
  mainView: MainView;

  mainMenuControl: MainMenuControl;

  keysControl: KeysControl;

  animationFrame: AnimationFrame;

  constructor(game: GameInterface) {
    this.mainView = new MainView();
    game.createScene();
    game.generateWorld();
    this.mainMenuControl = new MainMenuControl(this.mainView.mainMenu, game);
    this.keysControl = new KeysControl(game);
    this.keysControl.createKeyboardControls();
    this.animationFrame = new AnimationFrame(game);
  }
}

export default MainController;
