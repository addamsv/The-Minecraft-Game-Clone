import MainMenu from './mainMenu';
import ServerMenu from './serverMenu';
import SettingsMenu from './settingsMenu';
import QuitConfirm from './quitConfirm';
import ChatView from './chatView';
import GameView from './gameView';
import MainControllerInterface from '../controllers/mainControllerInterface';
import MainModelInterface from '../models/mainModelInterface';
import settingsConfig from '../configs/settingsConfig';
import GameViewInterface from './gameView/gameViewInterface';
import ViewsInterface from './viewsInterface';
import MenuViewInterface from './menuViewInteface';

class MenuView implements MenuViewInterface {
  gameView: GameViewInterface;

  mainMenu: ViewsInterface;

  serverMenu: ViewsInterface;

  settingsMenu: ViewsInterface;

  quitConfirm: ViewsInterface;

  chatView: ChatView;

  constructor(controller: MainControllerInterface, model: MainModelInterface) {
    this.gameView = new GameView(controller);
    this.mainMenu = new MainMenu(controller);
    this.mainMenu.attachMenu();
    this.serverMenu = new ServerMenu(controller, model);
    this.settingsMenu = new SettingsMenu(controller, this);
    this.quitConfirm = new QuitConfirm(controller);
    this.chatView = new ChatView(controller, model);
    this.checkLocalLanguage();
  }

  checkLocalLanguage() {
    let language = 'en';
    if (localStorage.getItem('rscloneMinecraftLanguage')) {
      language = localStorage.getItem('rscloneMinecraftLanguage');
    } else {
      localStorage.setItem('rscloneMinecraftLanguage', 'en');
    }
    this.setLanguage(language);
  }

  public setLanguage(language: string) {
    settingsConfig.language = language;
    localStorage.setItem('rscloneMinecraftLanguage', language);
    this.mainMenu.addTextContent(language);
    this.serverMenu.addTextContent(language);
    this.settingsMenu.addTextContent(language);
    this.quitConfirm.addTextContent(language);
    this.chatView.addTextContent(language);
  }
}

export default MenuView;
