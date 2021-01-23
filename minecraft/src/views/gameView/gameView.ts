import MainControllerInterface from '../../controllers/mainControllerInterface';
import GameViewInterface from './gameViewInterface';

class GameView implements GameViewInterface {
  private controller: MainControllerInterface;

  private playerInterface: HTMLDivElement;

  private lightIcon: HTMLDivElement;

  private swordIcon: HTMLDivElement;

  private lightControl: HTMLSpanElement;

  private swordControl: HTMLSpanElement;

  private playerControls: any;

  constructor(controller: MainControllerInterface) {
    this.controller = controller;
    this.createView();
  }

  private createView() {
    this.playerInterface = document.createElement('div');
    this.lightIcon = document.createElement('div');
    this.swordIcon = document.createElement('div');
    this.lightControl = document.createElement('span');
    this.swordControl = document.createElement('span');

    this.playerInterface.classList.add('player-interface');
    this.lightIcon.classList.add('light');
    this.swordIcon.classList.add('sword');
    this.lightControl.classList.add('light-control');
    this.swordControl.classList.add('sword-control');

    this.lightControl.textContent = '1';
    this.swordControl.textContent = '2';

    this.lightIcon.append(this.lightControl);
    this.swordIcon.append(this.swordControl);
    this.playerInterface.append(this.lightIcon, this.swordIcon);

    this.playerControls = this.controller.playerControls.bind(this.controller);
  }

  public attachView() {
    document.body.append(this.playerInterface);
    this.addEventListeners();
  }

  public removeView() {
    this.playerInterface.remove();
    this.removeEventListeners();
  }

  public takeLantern() {
    this.lightIcon.classList.add('in-hand');
  }

  public hideLantern() {
    this.lightIcon.classList.remove('in-hand');
  }

  private addEventListeners() {
    document.body.addEventListener('keydown', this.playerControls);
  }

  private removeEventListeners() {
    document.body.removeEventListener('keydown', this.playerControls);
  }
}

export default GameView;
