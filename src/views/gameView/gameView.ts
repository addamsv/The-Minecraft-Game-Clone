import MainControllerInterface from '../../controllers/mainControllerInterface';
import GameViewInterface from './gameViewInterface';

const COOLDOWN_TIME = 2000;

class GameView implements GameViewInterface {
  private controller: MainControllerInterface;

  private playerInterface: HTMLDivElement;

  private lightCooldown: HTMLDivElement;

  private swordCooldown: HTMLDivElement;

  private lightIcon: HTMLDivElement;

  private swordIcon: HTMLDivElement;

  private lightControl: HTMLSpanElement;

  private swordControl: HTMLSpanElement;

  private playerControlsDown: any;

  private playerControlsUp: any;

  private swordControls: any;

  constructor(controller: MainControllerInterface) {
    this.controller = controller;
    this.createView();
  }

  private createView() {
    this.playerInterface = document.createElement('div');
    this.lightCooldown = document.createElement('div');
    this.swordCooldown = document.createElement('div');
    this.lightIcon = document.createElement('div');
    this.swordIcon = document.createElement('div');
    this.lightControl = document.createElement('span');
    this.swordControl = document.createElement('span');

    this.playerInterface.classList.add('player-interface', 'animated');
    this.lightCooldown.classList.add('cooldown');
    this.swordCooldown.classList.add('cooldown');
    this.lightIcon.classList.add('light');
    this.swordIcon.classList.add('sword');
    this.lightControl.classList.add('light-control');
    this.swordControl.classList.add('sword-control');

    this.lightControl.textContent = '1';
    this.swordControl.textContent = '2';

    this.lightIcon.append(this.lightCooldown, this.lightControl);
    this.swordIcon.append(this.swordCooldown, this.swordControl);
    this.playerInterface.append(this.lightIcon, this.swordIcon);

    this.playerControlsDown = this.controller.playerControlsDown.bind(this.controller);
    this.playerControlsUp = this.controller.playerControlsUp.bind(this.controller);
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
      { height: '100%' },
      { height: '0' },
    ], {
      duration: COOLDOWN_TIME,
    });
  }

  public addLanternClass() {
    this.lightIcon.classList.add('in-hand');
  }

  public removeLanternClass() {
    this.lightIcon.classList.remove('in-hand');
  }

  public showSwordCooldown() {
    this.swordCooldown.animate([
      { height: '100%' },
      { height: '0' },
    ], {
      duration: COOLDOWN_TIME,
    });
  }

  public addSwordClass() {
    this.swordIcon.classList.add('in-hand');
  }

  public removeSwordClass() {
    this.swordIcon.classList.remove('in-hand');
  }

  private addEventListeners() {
    document.body.addEventListener('keydown', this.playerControlsDown);
    document.body.addEventListener('keyup', this.playerControlsUp);
    document.body.addEventListener('mousedown', this.swordControls);
  }

  private removeEventListeners() {
    document.body.removeEventListener('keydown', this.playerControlsDown);
    document.body.removeEventListener('keyup', this.playerControlsUp);
    document.body.removeEventListener('mousedown', this.swordControls);
  }
}

export default GameView;
