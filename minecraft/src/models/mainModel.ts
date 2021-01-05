import ServerRequest from './modules/serverRequest';

class MainModel {
  serverRequest: ServerRequest;

  constructor() {
    this.serverRequest = new ServerRequest();
  }
}

export default MainModel;
