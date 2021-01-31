import ViewsInterface from '../viewsInterface';
import MainControllerInterface from '../../controllers/mainControllerInterface';
import settingsConfig from '../../configs/settingsConfig';
import languageConfig from '../../configs/languageConfig';
import MenuViewInterface from '../menuViewInteface';

class SettingsMenu implements ViewsInterface {
  private controller: MainControllerInterface;

  private view: MenuViewInterface;

  private settingsMenuScreen: HTMLDivElement;

  private musicInput: HTMLInputElement;

  private musicLabel: HTMLSpanElement;

  private soundsInput: HTMLInputElement;

  private soundsLabel: HTMLSpanElement;

  private musicValue: HTMLSpanElement;

  private soundsValue: HTMLSpanElement;

  private brightnessInput: HTMLInputElement;

  private brightnessLabel: HTMLSpanElement;

  private brightnessValue: HTMLSpanElement;

  private rangeInput: HTMLInputElement;

  private rangeLabel: HTMLSpanElement;

  private fovInput: HTMLInputElement;

  private fovLabel: HTMLSpanElement;

  private rangeValue: HTMLSpanElement;

  private fovValue: HTMLSpanElement;

  private langBtn: HTMLButtonElement;

  private okBtn: HTMLButtonElement;

  private changeVolumeSettings: any;

  private changeMusicSound: any;

  private changeBrightnessSetting: any;

  private changeLightSettings: any;

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
    this.musicLabel.textContent = languageData.musicLabel;
    this.soundsLabel.textContent = languageData.soundsLabel;
    this.brightnessLabel.textContent = languageData.brightnessLabel;
    this.rangeLabel.textContent = languageData.rangeLabel;
    this.fovLabel.textContent = languageData.fovLabel;
  }

  private createMenu() {
    this.settingsMenuScreen = document.createElement('div');
    const settingsWrapper = document.createElement('div');
    this.langBtn = document.createElement('button');
    this.okBtn = document.createElement('button');

    this.okBtn.textContent = 'OK';

    // sound settings
    const volumeWrapper = document.createElement('div');
    const musicWrapper = document.createElement('div');
    const soundsWrapper = document.createElement('div');
    this.musicInput = document.createElement('input');
    this.soundsInput = document.createElement('input');
    this.musicLabel = document.createElement('span');
    this.musicValue = document.createElement('span');
    this.soundsLabel = document.createElement('span');
    this.soundsValue = document.createElement('span');

    this.musicInput.type = 'range';
    this.musicInput.name = 'range';
    this.musicInput.min = settingsConfig.music.min;
    this.musicInput.max = `${Number(settingsConfig.music.max) * 100}`;
    this.musicInput.value = `${Number(settingsConfig.music.cur) * 100}`;
    this.musicValue.textContent = `${Number(settingsConfig.music.cur) * 100} %`;

    this.soundsInput.type = 'range';
    this.soundsInput.name = 'range';
    this.soundsInput.min = settingsConfig.sounds.min;
    this.soundsInput.max = `${Number(settingsConfig.sounds.max) * 100}`;
    this.soundsInput.value = `${Number(settingsConfig.sounds.cur) * 100}`;
    this.soundsValue.textContent = `${Number(settingsConfig.sounds.cur) * 100} %`;

    volumeWrapper.classList.add('volume-wrapper');
    musicWrapper.classList.add('music-wrapper');
    soundsWrapper.classList.add('sounds-wrapper');
    this.musicInput.classList.add('range-input');
    this.soundsInput.classList.add('range-input');
    this.musicLabel.classList.add('label-input');
    this.musicValue.classList.add('label-input');
    this.soundsLabel.classList.add('label-input');
    this.soundsValue.classList.add('label-input');

    musicWrapper.append(this.musicInput, this.musicLabel, this.musicValue);
    soundsWrapper.append(this.soundsInput, this.soundsLabel, this.soundsValue);
    volumeWrapper.append(musicWrapper, soundsWrapper);

    // change brightness
    const brightnessWrapper = document.createElement('div');
    this.brightnessInput = document.createElement('input');
    this.brightnessLabel = document.createElement('span');
    this.brightnessValue = document.createElement('span');

    this.brightnessInput.type = 'range';
    this.brightnessInput.name = 'range';
    this.brightnessInput.min = `${Number(settingsConfig.brightness.min) * 100}`;
    this.brightnessInput.max = `${Number(settingsConfig.brightness.max) * 100}`;
    this.brightnessInput.value = `${Number(settingsConfig.brightness.cur) * 100}`;
    this.brightnessValue.textContent = `${Number(settingsConfig.brightness.cur) * 100} %`;

    brightnessWrapper.classList.add('input-wrapper');
    this.brightnessInput.classList.add('range-input');
    this.brightnessLabel.classList.add('label-input');
    this.brightnessValue.classList.add('label-input');

    brightnessWrapper.append(this.brightnessInput, this.brightnessLabel, this.brightnessValue);

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

    // page
    this.settingsMenuScreen.id = 'settings-screen-id';
    this.settingsMenuScreen.classList.add('settings-menu-screen');
    settingsWrapper.classList.add('settings-wrapper');
    this.langBtn.classList.add('lang-btn');
    this.okBtn.classList.add('ok-btn');

    settingsWrapper.append(
      volumeWrapper,
      brightnessWrapper,
      rangeWrapper,
      fovWrapper,
      this.langBtn,
    );
    this.settingsMenuScreen.append(settingsWrapper, this.okBtn);

    this.changeVolumeSettings = this.controller.changeVolumeSettings.bind(this.controller);
    this.changeMusicSound = this.changeVolume.bind(this);
    this.changeBrightnessSetting = this.changeBrightness.bind(this);
    this.changeLightSettings = this.controller.changeLightSettings.bind(this.controller);
    this.changeCameraSettings = this.controller.changeCameraSettings.bind(this.controller);
    this.changeRangeSetting = this.changeRange.bind(this);
    this.changeFovSetting = this.changeFov.bind(this);
    this.changeLanguageSetting = this.changeLanguage.bind(this);
    this.closeSettingsMenu = this.controller.closeSettingsMenu.bind(this.controller);
  }

  private changeVolume() {
    this.musicValue.textContent = `${this.musicInput.value} %`;
    this.soundsValue.textContent = `${this.soundsInput.value} %`;
    this.changeVolumeSettings(this.musicInput.value, this.soundsInput.value);
  }

  private changeBrightness() {
    this.brightnessValue.textContent = `${this.brightnessInput.value} %`;
    this.changeLightSettings(this.brightnessInput.value);
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
      case 'Language: English': {
        this.view.setLanguage('ru');
        break;
      }
      case 'Язык: Русский': {
        this.view.setLanguage('en');
        break;
      }
      default: break;
    }
  }

  private addEventListeners() {
    this.musicInput.addEventListener('mousemove', this.changeMusicSound);
    this.soundsInput.addEventListener('mousemove', this.changeMusicSound);
    this.brightnessInput.addEventListener('mousemove', this.changeBrightnessSetting);
    this.rangeInput.addEventListener('mousemove', this.changeRangeSetting);
    this.fovInput.addEventListener('mousemove', this.changeFovSetting);
    this.langBtn.addEventListener('click', this.changeLanguageSetting);
    this.okBtn.addEventListener('click', this.closeSettingsMenu);
  }

  private removeEventListeners() {
    this.musicInput.removeEventListener('mousemove', this.changeMusicSound);
    this.soundsInput.removeEventListener('mousemove', this.changeMusicSound);
    this.brightnessInput.removeEventListener('mousemove', this.changeBrightnessSetting);
    this.rangeInput.removeEventListener('mousemove', this.changeRangeSetting);
    this.fovInput.removeEventListener('mousemove', this.changeFovSetting);
    this.langBtn.removeEventListener('click', this.changeLanguageSetting);
    this.okBtn.removeEventListener('click', this.closeSettingsMenu);
  }
}

export default SettingsMenu;
