import MainControllerInterface from '../../controllers/mainControllerInterface';
import GameViewInterface from './gameViewInterface';

class GameView implements GameViewInterface {
  private controller: MainControllerInterface;

  private playerInterface: HTMLDivElement;

  private lightCooldown: HTMLDivElement;

  private lightIcon: HTMLDivElement;

  private swordIcon: HTMLDivElement;

  private lightControl: HTMLSpanElement;

  private swordControl: HTMLSpanElement;

  private playerControls: any;

  private swordControls: any;

  constructor(controller: MainControllerInterface) {
    this.controller = controller;
    this.createView();
  }

  private createView() {
    this.playerInterface = document.createElement('div');
    this.lightCooldown = document.createElement('div');
    this.lightIcon = document.createElement('div');
    this.swordIcon = document.createElement('div');
    this.lightControl = document.createElement('span');
    this.swordControl = document.createElement('span');

    this.playerInterface.classList.add('player-interface');
    this.lightCooldown.classList.add('cooldown');
    this.lightIcon.classList.add('light');
    this.swordIcon.classList.add('sword');
    this.lightControl.classList.add('light-control');
    this.swordControl.classList.add('sword-control');

    this.lightControl.textContent = '1';
    this.swordControl.textContent = '2';

    this.lightIcon.append(this.lightCooldown, this.lightControl);
    this.swordIcon.append(this.swordControl);
    this.playerInterface.append(this.lightIcon, this.swordIcon);

    this.playerControls = this.controller.playerControls.bind(this.controller);
    this.swordControls = this.controller.swordControls.bind(this.controller);
  }

  public attachView() {
    document.body.append(this.playerInterface);
    this.addEventListeners();
  }

  public removeView() {
    this.playerInterface.remove();
    this.removeEventListeners();
  }

  public showLanternCooldown() {
    this.lightCooldown.animate([
      // keyframes
      { height: '100%' },
      { height: '0' },
    ], {
      // timing options
      duration: 2000,
    });
  }

  public addLanternClass() {
    this.lightIcon.classList.add('in-hand');
  }

  public removeLanternClass() {
    this.lightIcon.classList.remove('in-hand');
  }

  public addSwordClass() {
    this.swordIcon.classList.add('in-hand');
  }

  public removeSwordClass() {
    this.swordIcon.classList.remove('in-hand');
  }

  private addEventListeners() {
    document.body.addEventListener('keydown', this.playerControls);
    document.body.addEventListener('mousedown', this.swordControls);
  }

  private removeEventListeners() {
    document.body.removeEventListener('keydown', this.playerControls);
    document.body.removeEventListener('mousedown', this.swordControls);
  }
}

export default GameView;
