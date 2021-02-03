/* eslint-disable no-unused-vars */

interface MainControllerInterface {
  isServerGameStart: boolean;

  startSingleGame(): any;
  startServerGame(): any;

  openServerMenu(): any;
  closeServerMenu(): any;
  logOut(): any;
  disconnect(): any;

  openSettingsMenu(): any;
  openQuitConfirm(): any;
  changeVolumeSettings(music: number, sounds: number): any;
  changeLightSettings(brightness: number): any;
  changeCameraSettings(far: number, fov: number): any;
  closeSettingsMenu(): any;

  quitGame(): any;
  closeQuitConfirm(): any;

  setChatStatus(message: string): any;

  playerControlsDown(event: any): any;

  playerControlsUp(event: any): any;

  swordControls(): any;

  getMenuView(): any;
}

export default MainControllerInterface;
