import languageConfig from '../../configs/languageConfig';

class quitConfirm {
  quitConfirmScreen: HTMLDivElement;

  confirmMessage: HTMLSpanElement;

  yesBtn: HTMLButtonElement;

  noBtn: HTMLButtonElement;

  constructor() {
    this.createMenu();
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

  public toggle() {
    this.quitConfirmScreen.classList.toggle('hide');
  }

  private createMenu() {
    this.quitConfirmScreen = document.createElement('div');
    const quitConfirmWrapper = document.createElement('div');
    this.confirmMessage = document.createElement('span');
    const btnsWrapper = document.createElement('div');
    this.yesBtn = document.createElement('button');
    this.noBtn = document.createElement('button');

    this.quitConfirmScreen.classList.add('quit-confirm-screen', 'hide');
    quitConfirmWrapper.classList.add('quit-confirm-wrapper');
    this.confirmMessage.classList.add('confirm-message');
    btnsWrapper.classList.add('btns-wrapper');
    this.yesBtn.classList.add('yes-btn');
    this.noBtn.classList.add('no-btn');

    btnsWrapper.append(this.yesBtn, this.noBtn);
    quitConfirmWrapper.append(this.confirmMessage, btnsWrapper);
    this.quitConfirmScreen.append(quitConfirmWrapper);
    document.body.appendChild(this.quitConfirmScreen);
  }
}

export default quitConfirm;
