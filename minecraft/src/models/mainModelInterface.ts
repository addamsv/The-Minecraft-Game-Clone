/* eslint-disable no-unused-vars */

interface MainModelInterface {
  auth(login: String, password: String): void;

  sendHeroCoordinates(x: String, z: String): void;
}

export default MainModelInterface;
