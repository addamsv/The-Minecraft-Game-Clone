/* eslint-disable no-unused-vars */

interface MainControllerInterface {
  startSingleGame(): any;
  startServerGame(): any;

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

  playerControlsDown(event: any): any;

  playerControlsUp(event: any): any;

  swordControls(): any;

  // hitControls(): any;

  // onKeyDown(event: PlayerEvent): void;

  // onKeyUp(event: PlayerEvent): void;
}

export default MainControllerInterface;
