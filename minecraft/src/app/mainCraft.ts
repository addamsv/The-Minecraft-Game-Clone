import MainView from '../views/mainView';
import GameInit from '../models/modules/gameInit';
import MainController from '../conltollers/mainController';

class MainCraft {
  mainView: MainView;

  game: GameInit;

  mainController: MainController;

  constructor() {
    this.game = new GameInit();
    this.game.createScene();
    this.game.generateWorld();

    this.mainView = new MainView();

    this.mainController = new MainController(this.mainView.mainMenu, this.game);
  }
}

export default MainCraft;
