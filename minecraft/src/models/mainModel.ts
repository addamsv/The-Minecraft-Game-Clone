import GameInterface from '../interfaces/gameInterface';

import Game from './modules/gameInit';
import ServerRequest from './modules/serverRequest';

class MainModel {
  game: GameInterface;

  serverRequest: ServerRequest;

  constructor() {
    this.game = new Game();
    this.serverRequest = new ServerRequest();
  }
}

export default MainModel;
