import MainView from '../views/mainView';
import MainModel from '../models/mainModel';
import MainController from '../conltollers/mainController';

class MainCraft {
  mainView: MainView;

  mainModel: MainModel;

  mainController: MainController;

  constructor() {
    this.mainModel = new MainModel();

    this.mainView = new MainView();

    this.mainController = new MainController(this.mainView.mainMenu, this.mainModel.game);
  }
}

export default MainCraft;
