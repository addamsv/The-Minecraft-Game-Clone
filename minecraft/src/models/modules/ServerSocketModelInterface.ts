/* eslint-disable no-unused-vars */

interface ServerSocketModelInterface {
  isHandshaked(): boolean;

  init(login: any, password: any): void;

  setSeed(seed: String): void;

  getSeed(): string;

  /**
   *  Send Message To the Heroku Server Through Socket
   * @param x - X coordinate
   * @param z - Z coordinate
   * @param y - Y coordinate
   * @param c - Camera Angle
   */
  sendCoordinates(x: String, z: String, y: String, c: String): void;
}

export default ServerSocketModelInterface;
