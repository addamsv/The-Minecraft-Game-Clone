import ServerSocketModelInterface from './ServerSocketModelInterface';

class ServerSocketModel implements ServerSocketModelInterface {
  private USER_NAME: String;

  private TEXTAREA_OBJ: HTMLElement;

  private SCROLL_CONTAINER: HTMLElement;

  private DATA_TO_APPEND: HTMLElement;

  private ws: WebSocket;

  constructor(userName: String) {
    this.USER_NAME = userName;
    this.ws = null;
    this.TEXTAREA_OBJ = document.getElementById('sock-msg');
    this.SCROLL_CONTAINER = document.getElementById('scroll-container');
    this.DATA_TO_APPEND = document.getElementById('sock-info');
  }

  public init() {
    this.ws = new WebSocket('ws://rs-clone-server.herokuapp.com/');
    this.ws.onopen = this.connectionOpen.bind(this);
    this.ws.onmessage = this.messageReceived.bind(this);
    this.ws.onerror = this.connectionError.bind(this);
    this.ws.onclose = this.connectionClose.bind(this);

    this.sendMessageListener();
  }

  public sendMap(seed: String) {
    this.ws.send(`{"userName": "${this.USER_NAME}", "mesType": "map", "seed": "${seed}"}`);
  }

  public sendCoordinates(x: String, z: String) {
    this.ws.send(`{"userName": "${this.USER_NAME}", "mesType": "game", "xCoordinate": "${x}", "zCoordinate": "${z}"}`);
  }

  private sendMessage(value: String) {
    this.ws.send(`{"userName": "${this.USER_NAME}", "userMessage": "${value}"}`);
  }

  /*
  *   @private
  */
  private sendMessageListener() {
    const CONTEXT = this;
    this.TEXTAREA_OBJ.onkeydown = (event: any) => {
      if (event.keyCode === 13) {
        CONTEXT.sendMessage((<HTMLTextAreaElement>(CONTEXT.TEXTAREA_OBJ)).value);
      }
    };
  }

  private connectionError() {
    this.appendMessage(this.getHTMLMessageContainer('system', 'LAN: error'));
    this.scrollMessagesContainerToTop();
    this.removeMessageFromInputField();
  }

  private connectionOpen() {
    this.ws.send(`{"userName": "${this.USER_NAME}", "userMessage": "new web user has connected"}`);
  }

  private connectionClose() {
    this.ws.close();
    this.DATA_TO_APPEND.innerHTML += "<div class='info'> connection closed </div>";
    this.SCROLL_CONTAINER.scrollTop = this.SCROLL_CONTAINER.scrollHeight;
  }

  private messageReceived(message: any) {
    const mess = JSON.parse(message.data);
    if (!mess) {
      return;
    }
    switch (mess.mesType) {
      case 'game': console.log(mess); break;
      case 'map': console.log(mess); break;
      default: {
        this.appendMessage(this.getHTMLMessageContainer(mess.userName || 'User', mess.userMessage));
        this.scrollMessagesContainerToTop();
        this.removeMessageFromInputField();
        break;
      }
    }
  }

  private isItYours(user: String) {
    return this.USER_NAME === user;
  }

  private appendMessage(nodeToAppend: HTMLElement) {
    this.DATA_TO_APPEND.appendChild(nodeToAppend);
    while (this.DATA_TO_APPEND.childNodes.length > 100) {
      this.DATA_TO_APPEND.removeChild(this.DATA_TO_APPEND.firstChild);
    }
  }

  private scrollMessagesContainerToTop() {
    this.SCROLL_CONTAINER.scrollTop = this.SCROLL_CONTAINER.scrollHeight;
  }

  private removeMessageFromInputField() {
    (<HTMLTextAreaElement>(this.TEXTAREA_OBJ)).value = '';
  }

  private getHTMLMessageContainer(user: String, textMessage: string) {
    const TIME = '12:10:22';
    const CONTAINER: HTMLDivElement = document.createElement('div');
    const USER_INFO_CONTAINER = document.createElement('div');

    USER_INFO_CONTAINER.innerHTML = `${this.isItYours(user) ? '' : user} ${TIME}`;
    CONTAINER.className = this.isItYours(user) ? 'user-sock-info' : 'someone-sock-info';
    USER_INFO_CONTAINER.className = 'messInfo';

    CONTAINER.innerHTML = textMessage;
    CONTAINER.appendChild(USER_INFO_CONTAINER);

    return CONTAINER;
  }
}

export { ServerSocketModelInterface, ServerSocketModel };
