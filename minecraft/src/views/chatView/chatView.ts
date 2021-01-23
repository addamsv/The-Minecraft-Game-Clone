import MainControllerInterface from '../../controllers/mainControllerInterface';
import MainModelInterface from '../../models/mainModelInterface';
import ViewsInterface from '../viewsInterface';
import ChatViewInterface from './chatViewInterface';
import languageConfig from '../../configs/languageConfig';

class ChatView implements ViewsInterface, ChatViewInterface {
  private controller: MainControllerInterface;

  private model: MainModelInterface;

  private container: HTMLDivElement;

  private scrollContainer: any;

  private sockContainer: any;

  private sockInfo: any;

  private input: HTMLTextAreaElement;

  private setChatStatus: any;

  private chatHandler: any;

  constructor(controller: MainControllerInterface, model: MainModelInterface) {
    this.controller = controller;
    this.model = model;
    this.createMenu();
  }

  public appendSysMessage(message: string) {
    this.sockInfo.innerHTML += `<div class='info'>${message}</div>`;
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
  }

  public appendMessage(name: String, message: string, areYouMessageOwner: boolean) {
    const NODE = this.getHTMLMessageContainer(name, message, areYouMessageOwner);

    this.sockInfo.append(NODE);

    while (this.sockInfo.childNodes.length > 20) {
      this.sockInfo.removeChild(this.sockInfo.firstChild);
    }

    this.scrollMessagesContainerToTop();
  }

  public connect() {
    document.body.append(this.container);
    this.addEventListeners();
  }

  public disconnect() {
    this.container.remove();
    this.removeEventListeners();
  }

  public attachMenu() {
    this.container.append(this.input);
  }

  public removeMenu() {
    this.input.remove();
  }

  public addTextContent(language: string) {
    let languageData;
    switch (language) {
      case 'en': languageData = languageConfig.en.chatView; break;
      case 'ru': languageData = languageConfig.ru.chatView; break;
      default: break;
    }
    this.input.placeholder = languageData.placeholder;
  }

  private createMenu() {
    this.container = document.createElement('div');
    this.scrollContainer = document.createElement('div');
    this.sockContainer = document.createElement('div');
    this.sockInfo = document.createElement('div');
    this.input = document.createElement('textarea');

    // this.container.id = 'chat-container';
    // this.scrollContainer.id = 'scroll-container';
    // this.sockContainer.id = 'sock-container';
    // this.sockInfo.id = 'sock-info';
    // this.input.id = 'sock-msg';
    this.input.placeholder = 'Please Enter Your Message';
    this.input.autofocus = true;

    this.container.classList.add('chat-container');
    this.scrollContainer.classList.add('scroll-container');
    this.sockContainer.classList.add('sock-container');
    this.sockInfo.classList.add('sock-info');
    this.input.classList.add('sock-msg');

    this.sockContainer.append(this.sockInfo);
    this.scrollContainer.append(this.sockContainer);
    this.container.append(this.scrollContainer);

    this.setChatStatus = this.controller.setChatStatus.bind(this.controller);
    this.chatHandler = this.handleChat.bind(this);
  }

  handleChat(event: any) {
    if (event.which === 13) {
      event.preventDefault();
      this.setChatStatus(this.input.value);
      this.input.focus();
      this.input.value = '';
    }
  }

  private addEventListeners() {
    document.addEventListener('keydown', this.chatHandler);
  }

  private removeEventListeners() {
    document.removeEventListener('keydown', this.chatHandler);
  }

  private scrollMessagesContainerToTop() {
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
  }

  // eslint-disable-next-line
  private getHTMLMessageContainer(name: String, message: string, areMessageOwner: Boolean) {
    const TIME = new Date().toLocaleTimeString();
    const CONTAINER: HTMLDivElement = document.createElement('div');
    const USER_INFO_CONTAINER = document.createElement('div');

    USER_INFO_CONTAINER.innerHTML = `${areMessageOwner ? '' : name} ${TIME}`;
    CONTAINER.className = areMessageOwner ? 'user-sock-info' : 'someone-sock-info';
    USER_INFO_CONTAINER.className = 'messInfo';

    CONTAINER.innerHTML = message;
    CONTAINER.append(USER_INFO_CONTAINER);

    return CONTAINER;
  }
}

export default ChatView;
