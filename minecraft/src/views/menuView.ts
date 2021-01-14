import MainMenu from './mainMenu';
import SettingsMenu from './settingsMenu';
import AuthForm from './authForm';
import QuitConfirm from './quitConfirm';
import Chat from './chat';
import MainModelInterface from '../models/mainModelInterface';

class MenuView {
  mainMenu: MainMenu;

  settingsMenu: SettingsMenu;

  authForm: AuthForm;

  quitConfirm: QuitConfirm;

  chat: Chat;

  constructor(model: MainModelInterface) {
    this.mainMenu = new MainMenu();
    this.settingsMenu = new SettingsMenu();
    this.authForm = new AuthForm();
    this.quitConfirm = new QuitConfirm();
    this.chat = new Chat(model);
  }
}

export default MenuView;
