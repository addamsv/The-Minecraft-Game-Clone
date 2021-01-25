/* eslint-disable no-unused-vars */

interface MainControllerInterface {
  startGame(): any;

  openServerMenu(): any;
  closeServerMenu(): any;

  openSettingsMenu(): any;
  openQuitConfirm(): any;
  changeCameraSettings(far: number, fov: number): any;
  closeSettingsMenu(): any;

  quitGame(): any;
  closeQuitConfirm(): any;

  setChatStatus(message: string): any;
  getChatView(): any;

  prepareToStartGame(): void;

  createKeyboardControls(): void;

  playerControls(event: any): any;

  swordControls(): any;
  // onKeyDown(event: PlayerEvent): void;

  // onKeyUp(event: PlayerEvent): void;
}

export default MainControllerInterface;
