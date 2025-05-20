import MainController from '../controllers/mainController';

class MineCraft {
  mainController: MainController;

  start() {
    this.mainController = new MainController();
  }
}

export default MineCraft;
