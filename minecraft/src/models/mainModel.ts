import MainModelInterface from './mainModelInterface';
import { ServerSocketModelInterface, ServerSocketModel } from './modules/serverSocketModel';
import { ServerCRUDModelInterface, ServerCRUDModel } from './modules/serverCRUDModel';
import { StorageModelInterface, StorageModel } from './modules/storageModel';
import MainControllerInterface from '../controllers/mainControllerInterface';
// import env from '../configs/environmentVars';

interface MyResponse extends Response {
  statusCode: any;
}

class MainModel implements MainModelInterface {
  controller: MainControllerInterface;

  private rsServerSocket: ServerSocketModelInterface;

  private response: Response;

  private gameMapSeed: String;

  public serverCRUD: ServerCRUDModelInterface;

  public storageModel: StorageModelInterface;

  constructor(controller: MainControllerInterface) {
    this.controller = controller;
    this.response = null;

    this.rsServerSocket = new ServerSocketModel(this.controller);

    this.serverCRUD = new ServerCRUDModel();

    this.storageModel = new StorageModel(this.controller);
  }

  public getSocket() {
    return this.rsServerSocket;
  }

  public isHandshaked() {
    return this.rsServerSocket ? this.rsServerSocket.isHandshaked() : false;
  }

  public sendHeroCoordinates(x: String, z: String, y: String, c: String) {
    if (this.rsServerSocket) {
      this.rsServerSocket.sendCoordinates(x, z, y, c);
    }
  }

  public setSeed(seed: String) {
    if (this.rsServerSocket) {
      this.rsServerSocket.setSeed(seed);
    }
  }

  public getSeed() {
    return this.rsServerSocket ? this.rsServerSocket.getSeed() : '';
  }

  public loginThroughToken() {
    this.login();
  }

  public loginThroughPassword(name: string, password: string, type: string) {
    const regex = /\w{3,12}/;
    if (!regex.test(name) || !regex.test(password)) {
      const event = new CustomEvent('input-error');
      document.getElementById('server-menu-id').dispatchEvent(event);
    } else {
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

  // eslint-disable-next-line class-methods-use-this
  public exitChangePassMenu() {
    const event = new CustomEvent('exitChangePassMenu');
    document.getElementById('server-menu-id').dispatchEvent(event);
  }

  public logOut() {
    this.rsServerSocket.logOut();
    const event = new CustomEvent('logOut');
    document.getElementById('server-menu-id').dispatchEvent(event);
  }

  // eslint-disable-next-line class-methods-use-this
  public changePassword() {
    const event = new CustomEvent('makeChangePasswordMenu');
    document.getElementById('server-menu-id').dispatchEvent(event);
  }

  public sendNewPassword(newPassword: string) {
    const regex = /\w{3,12}/;
    if (!regex.test(newPassword)) {
      const event = new CustomEvent('input-error');
      document.getElementById('server-menu-id').dispatchEvent(event);
    } else {
      this.rsServerSocket.changePassword(newPassword);
      const event = new CustomEvent('changePassword');
      document.getElementById('server-menu-id').dispatchEvent(event);
    }
  }

  public signUp(login: String, password: String) {
    this.serverCRUD.create({ login, password })
      .then((data: MyResponse) => {
        console.log(data, 'SIGN UP RESPONSE');
      });
  }

  public login(login: String = '', password: String = '') {
    // this.rsServerSocket = new ServerSocketModel(this.controller);
    this.rsServerSocket.init(login, password);

    this.storageModel.init(this.rsServerSocket);
  }

  // public login(login: String, password: String) {
  //   this.serverCRUD.login({ login, password }, '')
  //     .then((data: MyResponse) => {
  //       let event;
  //       if (data.statusCode === 200) {
  //         event = new CustomEvent('success');
  //       } else {
  //         event = new CustomEvent('fail');
  //       }
  //       document.getElementById('server-menu-id').dispatchEvent(event);

  //       const respData: any = data;
  //       this.rsServerSocket = new ServerSocketModel(this.controller, respData.token);
  //       this.rsServerSocket.init();
  //     });
  // }
}

export { MainModelInterface, MainModel };
