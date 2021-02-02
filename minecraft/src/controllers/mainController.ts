/* eslint-disable class-methods-use-this */

import { MainModelInterface, MainModel } from '../models/mainModel';
import MainControllerInterface from './mainControllerInterface';
import MenuView from '../views/menuView';
import GameModel from '../models/gameModel';
import settingsConfig from '../configs/settingsConfig';

interface PlayerEvent extends Event {
  which: number;
}

class MainController implements MainControllerInterface {
  menuView: MenuView;

  gameModel: GameModel;

  isSingleGameStart: boolean;

  public isServerGameStart: boolean;

  isGamePause: boolean;

  isOpenChat: boolean;

  model: MainModelInterface;

  constructor() {
    this.model = new MainModel(this);
    this.isSingleGameStart = false;
    this.isServerGameStart = false;
    this.isGamePause = true;
    this.isOpenChat = false;
    this.menuView = new MenuView(this, this.model);
    this.gameModel = new GameModel(this.model);
    this.prepareToStartGame();
  }

  public getMenuView() {
    return this.menuView;
  }

  startSingleGame() {
    if (!this.isSingleGameStart && !this.isServerGameStart) {
      const seed = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      this.gameModel.generateWorld(seed);
      document.body.appendChild(this.gameModel.renderer.domElement);
      this.gameModel.sound.initSounds();
      this.gameModel.animationFrame();
      this.isSingleGameStart = true;
    }
    this.gameModel.control.lock();
  }

  startServerGame() {
    const seed = this.model.getSeed();
    if (!this.isServerGameStart && !this.isSingleGameStart) {
      this.gameModel.generateWorld(seed);
      document.body.appendChild(this.gameModel.renderer.domElement);
      this.gameModel.sound.initSounds();
      this.gameModel.animationFrame();
      this.isServerGameStart = true;
    }
    if (this.isSingleGameStart && this.gameModel.isLockPosition) {
      this.gameModel.destroyWorld();
      this.isSingleGameStart = false;
      this.startServerGame();
    }
    this.gameModel.control.lock();
  }

  openServerMenu() {
    this.menuView.mainMenu.removeMenu();
    this.menuView.serverMenu.attachMenu();
  }

  closeServerMenu() {
    this.menuView.serverMenu.removeMenu();
    this.menuView.mainMenu.attachMenu();
  }

  public logOut() {
    if (!this.isServerGameStart || this.gameModel.isLockPosition) {
      this.model.logOut();
      this.gameModel.destroyWorld();
      this.isServerGameStart = false;
    }
  }

  public disconnect() {
    if (!this.isServerGameStart || this.gameModel.isLockPosition) {
      console.log('mainController disconnect');
      this.model.disconnect();
      this.gameModel.destroyWorld();
      this.isServerGameStart = false;
    }
  }

  openSettingsMenu() {
    this.menuView.mainMenu.removeMenu();
    this.menuView.settingsMenu.attachMenu();
  }

  public changeVolumeSettings(music: number, sounds: number) {
    settingsConfig.music.cur = String(music / 100);
    settingsConfig.sounds.cur = String(sounds / 100);
    if (this.gameModel.sound.gainNodeBackground) {
      this.gameModel.sound.setBackgroundVolume();
    }
  }

  public changeLightSettings(brightness: number) {
    settingsConfig.brightness.cur = String(brightness / 100);
    this.gameModel.gameLight.setBrightness();
  }

  changeCameraSettings(far: number, fov: number) {
    this.gameModel.camera.far = Number(far);
    this.gameModel.camera.fov = Number(fov);
    this.gameModel.camera.updateProjectionMatrix();
  }

  closeSettingsMenu() {
    this.menuView.settingsMenu.removeMenu();
    this.menuView.mainMenu.attachMenu();
  }

  openQuitConfirm() {
    this.menuView.mainMenu.removeMenu();
    this.menuView.quitConfirm.attachMenu();
  }

  quitGame() {
    window.close();
  }

  closeQuitConfirm() {
    this.menuView.quitConfirm.removeMenu();
    this.menuView.mainMenu.attachMenu();
  }

  setChatStatus(message: string) {
    this.isOpenChat = !this.isOpenChat;
    if (this.isOpenChat) {
      this.gameModel.control.unlock();
      this.menuView.chatView.attachMenu();
    } else {
      this.gameModel.control.lock();
      this.menuView.chatView.removeMenu();
      const socket = this.model.getSocket();
      socket.sendMessage(message, 'chatMessage');
    }
  }

  // public getChatView() {
  //   return this.menuView.chatView;
  // }

  private prepareToStartGame() {
    this.model.setView(this.menuView);
    this.gameModel.setView(this.menuView);

    // pointerLock API controls
    const controls = this.gameModel.control;
    controls.addEventListener('lock', () => {
      if (this.isGamePause) {
        this.menuView.mainMenu.removeMenu();
        this.menuView.chatView.connect();
        this.menuView.gameView.attachView();
        this.menuView.statsView.attachMenu();
      }
      this.isGamePause = false;
    });
    controls.addEventListener('unlock', () => {
      if (!this.isOpenChat) {
        this.isGamePause = true;
        this.menuView.mainMenu.attachMenu();
        this.menuView.chatView.disconnect();
        this.menuView.gameView.removeView();
        this.menuView.statsView.removeMenu();
      }
    });
  }

  public playerControlsDown(event: PlayerEvent) {
    switch (event.which) {
      case 87: this.gameModel.forward = true; break;
      case 65: this.gameModel.left = true; break;
      case 83: this.gameModel.backward = true; break;
      case 68: this.gameModel.right = true; break;
      case 32: {
        if (this.gameModel.jump === true) {
          this.gameModel.speed.y += 150;
          this.gameModel.jumpSound = true;
        }
        this.gameModel.jump = false;
        break;
      }
      case 49: {
        this.gameModel.changeLanternStatus();
        break;
      }
      case 50: {
        this.gameModel.changeSwordStatus();
        break;
      }
      case 16: {
        this.gameModel.isShiftPressed = true;
        break;
      }
      default: break;
    }
  }

  public playerControlsUp(event: PlayerEvent) {
    switch (event.which) {
      case 87: this.gameModel.forward = false; break;
      case 65: this.gameModel.left = false; break;
      case 83: this.gameModel.backward = false; break;
      case 68: this.gameModel.right = false; break;
      case 16: this.gameModel.isShiftPressed = false; break;
      default: break;
    }
  }

  public swordControls() {
    this.gameModel.hitSword();
  }
}

export default MainController;
