import MainModelInterface from './mainModelInterface';
import { ServerSocketModelInterface, ServerSocketModel } from './modules/serverSocketModel';
import { ServerCRUDModelInterface, ServerCRUDModel } from './modules/serverCRUDModel';

class MainModel implements MainModelInterface {
  private rsServerSocket: ServerSocketModelInterface;

  private a: string;

  private response: Promise<Response>;

  public handshake: boolean;

  public serverCRUD: ServerCRUDModelInterface;

  constructor() {
    this.handshake = false;
    this.response = null;
    this.rsServerSocket = null;
    this.a = 'coordinates';

    this.serverCRUD = new ServerCRUDModel();
    console.log(this.serverCRUD.get());
  }

  public sendHeroCoordinates(x: String, z: String) {
    if (this.rsServerSocket) {
      this.rsServerSocket.sendCoordinates(x, z);
    }
  }

  public auth(login: String, password: String) {
    this.authorize({ login, password })
      .then((data) => {
        const respData: any = data;
        console.log(respData.name);
        this.rsServerSocket = new ServerSocketModel(respData.name);
        this.rsServerSocket.init();
        setTimeout(() => { this.handshake = true; }, 2000); // wait for handshakes, need refactor
      });
  }

  private async authorize(data = {}) {
    this.response = await fetch('https://rs-clone-server.herokuapp.com/players/auth/', {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    }).then((resData: any) => resData.json());
    return this.response;
  }
}

export { MainModelInterface, MainModel };
