import MainModelInterface from './mainModelInterface';
import { ServerSocketModelInterface, ServerSocketModel } from './modules/serverSocketModel';

class MainModel implements MainModelInterface {
  private rsServerSocket: ServerSocketModelInterface;

  private a: string;

  private response: Promise<Response>;

  constructor() {
    this.response = null;
    this.rsServerSocket = null;
  }

  public sendCoordinates(x: number, z: number) {
    this.getCoordinates(x, z);
  }

  public auth(login: String, password: String) {
    this.authorize({ login, password })
      .then((data) => {
        const respData: any = data;
        console.log(respData.name);
        this.rsServerSocket = new ServerSocketModel(respData.name);
        this.rsServerSocket.init();
      });
  }

  private getCoordinates(x: number, z: number) {
    console.log(`${this.a} ${x}:${z}`);
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
