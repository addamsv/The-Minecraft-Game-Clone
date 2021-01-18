import MainModelInterface from './mainModelInterface';
import { ServerSocketModelInterface, ServerSocketModel } from './modules/serverSocketModel';
import { ServerCRUDModelInterface, ServerCRUDModel } from './modules/serverCRUDModel';
// import env from '../configs/environmentVars';

interface MyResponse extends Response {
  statusCode: any;
}

class MainModel implements MainModelInterface {
  private rsServerSocket: ServerSocketModelInterface;

  private response: Response;

  private gameMapSeed: String;

  public handshake: Boolean;

  public serverCRUD: ServerCRUDModelInterface;

  constructor() {
    this.handshake = false;
    this.response = null;
    this.rsServerSocket = null;

    this.serverCRUD = new ServerCRUDModel();
    // console.log(this.serverCRUD.get());
  }

  public sendHeroCoordinates(x: String, z: String) {
    if (this.rsServerSocket) {
      this.rsServerSocket.sendCoordinates(x, z);
    }
  }

  public setSeed(seed: String) {
    if (this.rsServerSocket) {
      this.rsServerSocket.setSeed(seed);
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
          this.login(name, password);
          break;
        }
        case 'signup':
          this.signUp(name, password);
          break;
        default: break;
      }
    }
  }

  public signUp(login: String, password: String) {
    this.serverCRUD.create({ login, password })
      .then((data: MyResponse) => {
        console.log(data);
        // let event;
        // console.log(data);
        // if (data.statusCode === 200) {
        //   event = new CustomEvent('success');
        // } else {
        //   event = new CustomEvent('fail');
        // }
        // document.getElementById('server-menu-id').dispatchEvent(event);

        // const respData: any = data;
        // this.rsServerSocket = new ServerSocketModel(respData.token);
        // this.rsServerSocket.init();
        // setTimeout(() => { this.handshake = true; }, 2000); // wait for handshakes, need refactor
      });
  }

  public login(login: String, password: String) {
    this.serverCRUD.login({ login, password }, '')
      .then((data: MyResponse) => {
        let event;
        console.log(data);
        if (data.statusCode === 200) {
          event = new CustomEvent('success');
        } else {
          event = new CustomEvent('fail');
        }
        document.getElementById('server-menu-id').dispatchEvent(event);

        const respData: any = data;
        this.rsServerSocket = new ServerSocketModel(respData.token);
        this.rsServerSocket.init();
        setTimeout(() => { this.handshake = true; }, 2000); // wait for handshakes, need refactor
      });
    // this.authorize({ login, password })
    //   .then((data: MyResponse) => {
    //     let event;
    //     console.log(data);
    //     if (data.statusCode === 200) {
    //       event = new CustomEvent('success');
    //     } else {
    //       event = new CustomEvent('fail');
    //     }
    //     document.getElementById('server-menu-id').dispatchEvent(event);

    //     const respData: any = data;
    //     this.rsServerSocket = new ServerSocketModel(respData.token);
    //     this.rsServerSocket.init();
    //     setTimeout(() => { this.handshake = true; }, 2000); // wait for handshakes, need refactor
    //   });
  }

  // // eslint-disable-next-line class-methods-use-this
  // private async authorize(data = {}) {
  //   // eslint-disable-next-line no-return-await
  //   return await fetch(env.serverHost + env.loginRoute, {
  //     method: 'POST',
  //     mode: 'cors',
  //     cache: 'no-cache',
  //     credentials: 'same-origin',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     redirect: 'follow',
  //     referrerPolicy: 'no-referrer',
  //     body: JSON.stringify(data),
  //   }).then((resData: any) => resData.json());
  // }
}

export { MainModelInterface, MainModel };
