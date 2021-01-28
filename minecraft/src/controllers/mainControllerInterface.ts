/* eslint-disable no-unused-vars */

interface MainControllerInterface {
  startSingleGame(): any;
  startServerGame(): any;

  openServerMenu(): any;
  closeServerMenu(): any;
  exitServerGame(): any;

  openSettingsMenu(): any;
  openQuitConfirm(): any;
  changeCameraSettings(far: number, fov: number): any;
  closeSettingsMenu(): any;

  quitGame(): any;
  closeQuitConfirm(): any;

  setChatStatus(message: string): any;
  getChatView(): any;

  playerControlsDown(event: any): any;

  playerControlsUp(event: any): any;

  swordControls(): any;
}

export default MainControllerInterface;
