import MainModel from '../models/mainModel';
import MainController from '../controllers/mainController';

class MainCraft {
  mainModel: MainModel;

  mainController: MainController;

  constructor() {
    this.mainModel = new MainModel();

    this.mainController = new MainController(this.mainModel.game);
  }
}

export default MainCraft;
