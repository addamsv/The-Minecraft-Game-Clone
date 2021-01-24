/* eslint-disable no-unused-vars */

interface GameLoader {
  loadTextures(): void;
  loadObjects(): void;
  loadPlayer(token: string): void;
}

export default GameLoader;
