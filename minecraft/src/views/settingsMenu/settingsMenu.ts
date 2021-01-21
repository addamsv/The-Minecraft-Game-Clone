import ViewsInterface from '../viewsInterface';
import MainControllerInterface from '../../controllers/mainControllerInterface';
import settingsConfig from '../../configs/settingsConfig';
import languageConfig from '../../configs/languageConfig';
import MenuViewInterface from '../menuViewInteface';

class SettingsMenu implements ViewsInterface {
  private controller: MainControllerInterface;

  private view: MenuViewInterface;

  private settingsMenuScreen: HTMLDivElement;

  private rangeInput: HTMLInputElement;

  private rangeLabel: HTMLSpanElement;

  private fovInput: HTMLInputElement;

  private fovLabel: HTMLSpanElement;

  private rangeValue: HTMLSpanElement;

  private fovValue: HTMLSpanElement;

  private langBtn: HTMLButtonElement;

  private okBtn: HTMLButtonElement;

  private changeCameraSettings: any;

  private changeRangeSetting: any;

  private changeFovSetting: any;

  private changeLanguageSetting: any;

  private closeSettingsMenu: any;

  constructor(controller: MainControllerInterface, view: MenuViewInterface) {
    this.controller = controller;
    this.view = view;
    this.createMenu();
  }

  public attachMenu() {
    document.body.append(this.settingsMenuScreen);
    this.addEventListeners();
  }

  public removeMenu() {
    this.settingsMenuScreen.remove();
    this.removeEventListeners();
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
    this.settingsMenuScreen.classList.add('settings-menu-screen');
    settingsWrapper.classList.add('settings-wrapper');
    this.langBtn.classList.add('lang-btn');
    this.okBtn.classList.add('ok-btn');

    settingsWrapper.append(rangeWrapper, fovWrapper, this.langBtn);
    this.settingsMenuScreen.append(settingsWrapper, this.okBtn);

    this.changeCameraSettings = this.controller.changeCameraSettings.bind(this.controller);
    this.changeRangeSetting = this.changeRange.bind(this);
    this.changeFovSetting = this.changeFov.bind(this);
    this.changeLanguageSetting = this.changeLanguage.bind(this);
    this.closeSettingsMenu = this.controller.closeSettingsMenu.bind(this.controller);
  }

  private changeRange() {
    this.rangeValue.textContent = this.rangeInput.value;
    this.changeCameraSettings(this.rangeInput.value, this.fovInput.value);
  }

  private changeFov() {
    this.fovValue.textContent = this.fovInput.value;
    this.changeCameraSettings(this.rangeInput.value, this.fovInput.value);
  }

  private changeLanguage() {
    switch (this.langBtn.textContent) {
      case 'English': {
        this.view.setLanguage('ru');
        break;
      }
      case 'Русский': {
        this.view.setLanguage('en');
        break;
      }
      default: break;
    }
  }

  private addEventListeners() {
    this.rangeInput.addEventListener('mousemove', this.changeRangeSetting);
    this.fovInput.addEventListener('mousemove', this.changeFovSetting);
    this.langBtn.addEventListener('click', this.changeLanguageSetting);
    this.okBtn.addEventListener('click', this.closeSettingsMenu);
  }

  private removeEventListeners() {
    this.rangeInput.removeEventListener('mousemove', this.changeRangeSetting);
    this.fovInput.removeEventListener('mousemove', this.changeFovSetting);
    this.langBtn.removeEventListener('click', this.changeLanguageSetting);
    this.okBtn.removeEventListener('click', this.closeSettingsMenu);
  }
}

export default SettingsMenu;
