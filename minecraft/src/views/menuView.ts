import MainMenu from './mainMenu';
import ServerMenu from './serverMenu';
import SettingsMenu from './settingsMenu';
import QuitConfirm from './quitConfirm';
import Chat from './chat';
import MainModelInterface from '../models/mainModelInterface';

class MenuView {
  mainMenu: MainMenu;

  serverMenu: ServerMenu;

  settingsMenu: SettingsMenu;

  quitConfirm: QuitConfirm;

  chat: Chat;

  constructor(model: MainModelInterface) {
    this.mainMenu = new MainMenu();
    this.serverMenu = new ServerMenu();
    this.settingsMenu = new SettingsMenu();
    this.quitConfirm = new QuitConfirm();
    this.chat = new Chat(model);
  }
}

export default MenuView;
