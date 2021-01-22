/* eslint-disable no-unused-vars */

interface MainModelInterface {
  getSocket(): any;

  isHandshaked(): boolean;

  setSeed(seed: String): void;

  getSeed(): string;

  checkStrings(name: string, password: string, type: string): void;

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
