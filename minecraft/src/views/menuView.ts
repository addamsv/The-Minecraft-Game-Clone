import MainMenu from './mainMenu';
import ServerMenu from './serverMenu';
import SettingsMenu from './settingsMenu';
import QuitConfirm from './quitConfirm';
import Chat from './chat';
import MainModelInterface from '../models/mainModelInterface';
import settingsConfig from '../configs/settingsConfig';

class MenuView {
  mainMenu: MainMenu;

  serverMenu: ServerMenu;

  settingsMenu: SettingsMenu;

  quitConfirm: QuitConfirm;

  chat: Chat;

  constructor(model: MainModelInterface) {
    let language = 'en';
    if (localStorage.getItem('rscloneMinecraftLanguage')) {
      language = localStorage.getItem('rscloneMinecraftLanguage');
    } else {
      localStorage.setItem('rscloneMinecraftLanguage', 'en');
    }
    this.mainMenu = new MainMenu();
    this.serverMenu = new ServerMenu();
    this.settingsMenu = new SettingsMenu();
    this.quitConfirm = new QuitConfirm();
    this.chat = new Chat(model);
    this.setLanguage(language);
  }

  public setLanguage(language: string) {
    settingsConfig.language = language;
    localStorage.setItem('rscloneMinecraftLanguage', language);
    this.mainMenu.addTextContent(language);
    this.serverMenu.addTextContent(language);
    this.settingsMenu.addTextContent(language);
    this.quitConfirm.addTextContent(language);
  }
}

export default MenuView;
