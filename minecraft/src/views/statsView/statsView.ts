import MainControllerInterface from '../../controllers/mainControllerInterface';

class StatsView {
  controller: MainControllerInterface;

  statsScreen: HTMLDivElement;

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
    this.statsScreen.textContent = `FPS: ${fps}`;
  }

  private createMenu() {
    this.statsScreen = document.createElement('div');
    this.statsScreen.classList.add('stats-screen');
  }
}

export default StatsView;
