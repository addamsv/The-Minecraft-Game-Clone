import settingsConfig from '../../configs/settingsConfig';
import languageConfig from '../../configs/languageConfig';

class SettingsMenu {
  settingsMenuScreen: HTMLDivElement;

  rangeInput: HTMLInputElement;

  rangeLabel: HTMLSpanElement;

  fovInput: HTMLInputElement;

  fovLabel: HTMLSpanElement;

  rangeValue: HTMLSpanElement;

  fovValue: HTMLSpanElement;

  langBtn: HTMLButtonElement;

  okBtn: HTMLButtonElement;

  constructor() {
    this.createMenu();
    this.getChanges();
  }

  public addTextContent(language: string) {
    let languageData;
    switch (language) {
      case 'en': languageData = languageConfig.en.settinsMenu; break;
      case 'ru': languageData = languageConfig.ru.settinsMenu; break;
      default: break;
    }
    this.langBtn.textContent = languageData.langBtn;
    this.rangeLabel.textContent = languageData.rangeLabel;
    this.fovLabel.textContent = languageData.fovLabel;
  }

  public toggle() {
    this.settingsMenuScreen.classList.toggle('hide');
  }

  private createMenu() {
    this.settingsMenuScreen = document.createElement('div');
    const settingsWrapper = document.createElement('div');
    this.langBtn = document.createElement('button');
    this.okBtn = document.createElement('button');

    this.okBtn.textContent = 'OK';

    // change distance
    const rangeWrapper = document.createElement('div');
    this.rangeInput = document.createElement('input');
    this.rangeLabel = document.createElement('span');
    this.rangeValue = document.createElement('span');

    this.rangeInput.type = 'range';
    this.rangeInput.name = 'range';
    this.rangeInput.min = settingsConfig.far.min;
    this.rangeInput.max = settingsConfig.far.max;
    this.rangeInput.value = settingsConfig.far.cur;
    this.rangeValue.textContent = settingsConfig.far.cur;

    rangeWrapper.classList.add('input-wrapper');
    this.rangeInput.classList.add('range-input');
    this.rangeLabel.classList.add('label-input');
    this.rangeValue.classList.add('label-input');

    rangeWrapper.append(this.rangeInput, this.rangeLabel, this.rangeValue);

    // change fov
    const fovWrapper = document.createElement('div');
    this.fovInput = document.createElement('input');
    this.fovLabel = document.createElement('span');
    this.fovValue = document.createElement('span');

    this.fovInput.type = 'range';
    this.fovInput.name = 'range';
    this.fovInput.min = settingsConfig.fov.min;
    this.fovInput.max = settingsConfig.fov.max;
    this.fovInput.value = settingsConfig.fov.cur;
    this.fovValue.textContent = settingsConfig.fov.cur;

    fovWrapper.classList.add('input-wrapper');
    this.fovInput.classList.add('range-input');
    this.fovLabel.classList.add('label-input');
    this.fovValue.classList.add('label-input');

    fovWrapper.append(this.fovInput, this.fovLabel, this.fovValue);

    this.settingsMenuScreen.id = 'settings-screen-id';
    this.settingsMenuScreen.classList.add('settings-menu-screen', 'hide');
    settingsWrapper.classList.add('settings-wrapper');
    this.langBtn.classList.add('lang-btn');
    this.okBtn.classList.add('ok-btn');

    settingsWrapper.append(rangeWrapper, fovWrapper, this.langBtn);
    this.settingsMenuScreen.append(settingsWrapper, this.okBtn);
    document.body.appendChild(this.settingsMenuScreen);
  }

  private getChanges() {
    this.rangeInput.addEventListener('mousemove', () => {
      this.rangeValue.textContent = this.rangeInput.value;
      const event = new CustomEvent('camera', {
        detail: {
          far: this.rangeInput.value,
          fov: this.fovInput.value,
        },
      });
      this.settingsMenuScreen.dispatchEvent(event);
    });

    this.fovInput.addEventListener('mousemove', () => {
      this.fovValue.textContent = this.fovInput.value;
      const event = new CustomEvent('camera', {
        detail: {
          far: this.rangeInput.value,
          fov: this.fovInput.value,
        },
      });
      this.settingsMenuScreen.dispatchEvent(event);
    });
  }
}

export default SettingsMenu;
