import cameraConfig from '../../configs/cameraConfig';

class SettingsMenu {
  settingsMenuScreen: HTMLDivElement;

  rangeInput: HTMLInputElement;

  fovInput: HTMLInputElement;

  rangeValue: HTMLSpanElement;

  fovValue: HTMLSpanElement;

  okBtn: HTMLButtonElement;

  constructor() {
    this.createMenu();
    this.getChanges();
  }

  createMenu() {
    this.settingsMenuScreen = document.createElement('div');
    const settingsWrapper = document.createElement('div');
    this.okBtn = document.createElement('button');

    this.okBtn.textContent = 'OK';

    // change distance
    const rangeWrapper = document.createElement('div');
    this.rangeInput = document.createElement('input');
    const rangeLabel = document.createElement('span');
    this.rangeValue = document.createElement('span');

    this.rangeInput.type = 'range';
    this.rangeInput.name = 'range';
    this.rangeInput.min = cameraConfig.far.min;
    this.rangeInput.max = cameraConfig.far.max;
    this.rangeInput.value = cameraConfig.far.cur;
    rangeLabel.textContent = 'distance: ';
    this.rangeValue.textContent = cameraConfig.far.cur;

    rangeWrapper.classList.add('input-wrapper');
    this.rangeInput.classList.add('range-input');

    rangeWrapper.append(this.rangeInput, rangeLabel, this.rangeValue);

    // change fov
    const fovWrapper = document.createElement('div');
    this.fovInput = document.createElement('input');
    const fovLabel = document.createElement('span');
    this.fovValue = document.createElement('span');

    this.fovInput.type = 'range';
    this.fovInput.name = 'range';
    this.fovInput.min = cameraConfig.fov.min;
    this.fovInput.max = cameraConfig.fov.max;
    this.fovInput.value = cameraConfig.fov.cur;
    fovLabel.textContent = 'fov: ';
    this.fovValue.textContent = cameraConfig.fov.cur;

    fovWrapper.classList.add('input-wrapper');
    this.fovInput.classList.add('range-input');

    fovWrapper.append(this.fovInput, fovLabel, this.fovValue);

    this.settingsMenuScreen.classList.add('settings-menu-screen', 'hide');
    settingsWrapper.classList.add('settings-wrapper');
    this.okBtn.classList.add('ok-btn');

    settingsWrapper.append(rangeWrapper, fovWrapper);
    this.settingsMenuScreen.append(settingsWrapper, this.okBtn);
    document.body.appendChild(this.settingsMenuScreen);
  }

  getChanges() {
    this.rangeInput.addEventListener('mousemove', () => {
      this.rangeValue.textContent = this.rangeInput.value;
      const event = new CustomEvent('camera', {
        detail: {
          far: this.rangeInput.value,
          fov: this.fovInput.value,
        },
      });
      document.body.dispatchEvent(event);
    });

    this.fovInput.addEventListener('mousemove', () => {
      this.fovValue.textContent = this.fovInput.value;
      const event = new CustomEvent('camera', {
        detail: {
          far: this.rangeInput.value,
          fov: this.fovInput.value,
        },
      });
      document.body.dispatchEvent(event);
    });
  }

  toggle() {
    this.settingsMenuScreen.classList.toggle('hide');
  }
}

export default SettingsMenu;
