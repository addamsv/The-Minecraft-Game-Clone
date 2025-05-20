import MainControllerInterface from '../../controllers/mainControllerInterface';

class StatsView {
  controller: MainControllerInterface;

  statsScreen: HTMLDivElement;

  fps: HTMLSpanElement;

  time: HTMLSpanElement;

  position: HTMLSpanElement;

  constructor(controller: MainControllerInterface) {
    this.controller = controller;
    this.createMenu();
  }

  public attachMenu() {
    document.body.append(this.statsScreen);
  }

  public removeMenu() {
    this.statsScreen.remove();
  }

  public setFps(fps: number) {
    this.fps.textContent = `FPS ${fps}`;
  }

  public setPosition(x: number, z: number) {
    this.position.textContent = `you are here ${x}:${z}`;
  }

  public setTime(time: number) {
    this.time.textContent = `you played ${Math.trunc(time / 60)} m ${time % 60} s`;
  }

  private createMenu() {
    this.statsScreen = document.createElement('div');
    this.fps = document.createElement('span');
    this.time = document.createElement('span');
    this.position = document.createElement('span');

    this.statsScreen.classList.add('stats-screen', 'animated');

    this.statsScreen.append(this.fps, this.time, this.position);
  }
}

export default StatsView;
