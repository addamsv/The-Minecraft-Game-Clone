import MainMenu from './mainMenu';
import MainModelInterface from '../models/mainModelInterface';

class MenuView {
  mainMenu: MainMenu;

  constructor(model: MainModelInterface) {
    this.mainMenu = new MainMenu(model);
  }
}

export default MenuView;
