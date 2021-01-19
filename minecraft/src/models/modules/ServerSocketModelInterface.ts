/* eslint-disable no-unused-vars */

interface ServerSocketModelInterface {
  isHandshaked(): boolean;

  init(): void;

  setSeed(seed: String): void;

  getSeed(): string;

  sendCoordinates(x: String, z: String): void;
}

export default ServerSocketModelInterface;
