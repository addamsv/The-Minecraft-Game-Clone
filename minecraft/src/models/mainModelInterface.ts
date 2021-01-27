/* eslint-disable no-unused-vars */
import StorageModelInterface from './modules/storageModelInterface';

interface MainModelInterface {
  storageModel: StorageModelInterface;

  getSocket(): any;

  isHandshaked(): boolean;

  setSeed(seed: String): void;

  getSeed(): string;

  exitChangePassMenu(): void;

  loginThroughPassword(name: string, password: string, type: string): void;

  loginThroughToken(name: string, password: string, type: string): void;

  logOut(): void;

  changePassword(): void;

  sendNewPassword(newPassword: string): void;

  /**
   *  Send Message To the Heroku Server Through Socket
   * @param x - X coordinate
   * @param z - Z coordinate
   * @param y - Y coordinate
   * @param c - Camera Angle
   */
  sendHeroCoordinates(x: String, z: String, y: String, c: String): void;
}

export default MainModelInterface;
