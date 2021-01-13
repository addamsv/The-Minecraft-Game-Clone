/* eslint-disable no-unused-vars */

interface MainModelInterface {
  handshake: boolean;

  auth(login: String, password: String): void;

  sendHeroCoordinates(x: String, z: String): void;
}

export default MainModelInterface;
