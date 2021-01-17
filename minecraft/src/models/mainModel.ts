import MainModelInterface from './mainModelInterface';
import { ServerSocketModelInterface, ServerSocketModel } from './modules/serverSocketModel';

interface MyResponse extends Response {
  statusCode: any;
}

class MainModel implements MainModelInterface {
  private rsServerSocket: ServerSocketModelInterface;

  private response: Promise<Response>;

  private gameMapSeed: String;

  public handshake: Boolean;

  constructor() {
    this.handshake = false;
    this.response = null;
    this.rsServerSocket = null;
  }

  public sendHeroCoordinates(x: String, z: String) {
    if (this.rsServerSocket) {
      this.rsServerSocket.sendCoordinates(x, z);
    }
  }

  public sendMap(seed: String) {
    this.gameMapSeed = seed;
    console.log(seed, 'in model');
    if (this.rsServerSocket) {
      this.rsServerSocket.sendMap(seed);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public checkStrings(name: string, password: string, type: string) {
    const regex = /\w{3,12}/;
    if (!regex.test(name) || !regex.test(password)) {
      const event = new CustomEvent('input-error');
      document.getElementById('server-menu-id').dispatchEvent(event);
    } else {
      console.log(type);
      switch (type) {
        case 'login': {
          this.auth(name, password);
          break;
        }
        case 'signup': break;
        default: break;
      }
    }
  }

  public auth(login: String, password: String) {
    this.authorize({ login, password })
      .then((data: MyResponse) => {
        let event;
        if (data.statusCode === 200) {
          event = new CustomEvent('success');
        } else {
          event = new CustomEvent('fail');
        }
        document.getElementById('server-menu-id').dispatchEvent(event);

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
    }).then((resData: MyResponse) => resData.json());
    return this.response;
  }
}

export { MainModelInterface, MainModel };
