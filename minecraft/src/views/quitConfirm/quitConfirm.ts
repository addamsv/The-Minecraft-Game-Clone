import ViewsInterface from '../viewsInterface';
import MainControllerInterface from '../../controllers/mainControllerInterface';
import languageConfig from '../../configs/languageConfig';

class QuitConfirm implements ViewsInterface {
  private controller: MainControllerInterface;

  private quitConfirmScreen: HTMLDivElement;

  private confirmMessage: HTMLSpanElement;

  private yesBtn: HTMLButtonElement;

  private noBtn: HTMLButtonElement;

  private quitGame: any;

  private closeQuitConfirm: any;

  constructor(controller: MainControllerInterface) {
    this.controller = controller;
    this.createMenu();
  }

  public attachMenu() {
    document.body.append(this.quitConfirmScreen);
    this.addEventListeners();
  }

  public removeMenu() {
    this.quitConfirmScreen.remove();
    this.removeEventListeners();
  }

  public addTextContent(language: string) {
    let languageData;
    switch (language) {
      case 'en': languageData = languageConfig.en.quitConfirm; break;
      case 'ru': languageData = languageConfig.ru.quitConfirm; break;
      default: break;
    }
    this.confirmMessage.textContent = languageData.confirmMessage;
    this.yesBtn.textContent = languageData.yesBtn;
    this.noBtn.textContent = languageData.noBtn;
  }

  private createMenu() {
    this.quitConfirmScreen = document.createElement('div');
    const quitConfirmWrapper = document.createElement('div');
    this.confirmMessage = document.createElement('span');
    const btnsWrapper = document.createElement('div');
    this.yesBtn = document.createElement('button');
    this.noBtn = document.createElement('button');

    this.quitConfirmScreen.classList.add('quit-confirm-screen');
    quitConfirmWrapper.classList.add('quit-confirm-wrapper');
    this.confirmMessage.classList.add('confirm-message');
    btnsWrapper.classList.add('btns-wrapper');
    this.yesBtn.classList.add('yes-btn');
    this.noBtn.classList.add('no-btn');

    btnsWrapper.append(this.yesBtn, this.noBtn);
    quitConfirmWrapper.append(this.confirmMessage, btnsWrapper);
    this.quitConfirmScreen.append(quitConfirmWrapper);

    this.quitGame = this.controller.quitGame.bind(this.controller);
    this.closeQuitConfirm = this.controller.closeQuitConfirm.bind(this.controller);
  }

  private addEventListeners() {
    this.yesBtn.addEventListener('click', this.quitGame);
    this.noBtn.addEventListener('click', this.closeQuitConfirm);
  }

  private removeEventListeners() {
    this.yesBtn.removeEventListener('click', this.quitGame);
    this.noBtn.removeEventListener('click', this.closeQuitConfirm);
  }
}

export default QuitConfirm;
