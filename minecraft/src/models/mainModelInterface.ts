/* eslint-disable no-unused-vars */

interface MainModelInterface {
  getSocket(): any;

  isHandshaked(): boolean;

  setSeed(seed: String): void;

  getSeed(): string;

  checkStrings(name: string, password: string, type: string): void;

  sendHeroCoordinates(x: String, z: String): void;
}

export default MainModelInterface;
