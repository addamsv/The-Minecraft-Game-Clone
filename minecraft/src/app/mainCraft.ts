import MainModel from '../models/mainModel';
import MainController from '../controllers/mainController';

class MainCraft {
  mainModel: MainModel;

  mainController: MainController;

  constructor() {
    this.mainModel = new MainModel();

    this.mainController = new MainController();
  }
}

export default MainCraft;
