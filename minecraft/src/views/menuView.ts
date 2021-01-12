import MainMenu from './mainMenu';
import AuthForm from './authForm';
import Chat from './chat';
import MainModelInterface from '../models/mainModelInterface';

class MenuView {
  mainMenu: MainMenu;

  authForm: AuthForm;

  chat: Chat;

  constructor(model: MainModelInterface) {
    this.mainMenu = new MainMenu();
    this.authForm = new AuthForm();
    this.chat = new Chat(model);
  }
}

export default MenuView;
