/* eslint-disable no-unused-vars */

interface MainControllerInterface {
  isServerGameStart: boolean;

  startSingleGame(): any;
  startServerGame(): any;

  openServerMenu(): any;
  closeServerMenu(): any;
  logOut(): any;

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
