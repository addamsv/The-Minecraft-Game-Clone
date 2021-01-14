class quitConfirm {
  quitConfirmScreen: HTMLDivElement;

  rangeInput: HTMLInputElement;

  yesBtn: HTMLButtonElement;

  noBtn: HTMLButtonElement;

  constructor() {
    this.quitConfirmScreen = document.createElement('div');
    const quitConfirmWrapper = document.createElement('div');
    const confirmMessage = document.createElement('span');
    const btnsWrapper = document.createElement('div');
    this.yesBtn = document.createElement('button');
    this.noBtn = document.createElement('button');

    confirmMessage.textContent = 'Are you sure?';
    this.yesBtn.textContent = 'Yes';
    this.noBtn.textContent = 'No';

    this.quitConfirmScreen.classList.add('quit-confirm-screen', 'hide');
    quitConfirmWrapper.classList.add('quit-confirm-wrapper');
    confirmMessage.classList.add('confirm-message');
    btnsWrapper.classList.add('btns-wrapper');
    this.yesBtn.classList.add('yes-btn');
    this.noBtn.classList.add('no-btn');

    btnsWrapper.append(this.yesBtn, this.noBtn);
    quitConfirmWrapper.append(confirmMessage, btnsWrapper);
    this.quitConfirmScreen.append(quitConfirmWrapper);
    document.body.appendChild(this.quitConfirmScreen);
  }

  toggle() {
    this.quitConfirmScreen.classList.toggle('hide');
  }
}

export default quitConfirm;
