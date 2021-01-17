import ChatViewModelInterface from './ChatViewModelInterface';

class ChatViewModel implements ChatViewModelInterface {
  private SCROLL_CONTAINER: HTMLElement;

  private TEXTAREA_OBJ: HTMLElement;

  private DATA_TO_APPEND: HTMLElement;

  constructor() {
    this.TEXTAREA_OBJ = document.getElementById('sock-msg');
    this.SCROLL_CONTAINER = document.getElementById('scroll-container');
    this.DATA_TO_APPEND = document.getElementById('sock-info');
  }

  public appendSysMessage(textMessage: string) {
    this.DATA_TO_APPEND.innerHTML += `<div class='info'>${textMessage}</div>`;
    this.SCROLL_CONTAINER.scrollTop = this.SCROLL_CONTAINER.scrollHeight;
  }

  public appendMessage(userName: String, textMessage: string, areYouMessageOwner: Boolean) {
    const NODE = this.getHTMLMessageContainer(userName, textMessage, areYouMessageOwner);

    this.DATA_TO_APPEND.appendChild(NODE);

    while (this.DATA_TO_APPEND.childNodes.length > 100) {
      this.DATA_TO_APPEND.removeChild(this.DATA_TO_APPEND.firstChild);
    }

    this.scrollMessagesContainerToTop();
    this.removeMessageFromInputField();
  }

  private scrollMessagesContainerToTop() {
    this.SCROLL_CONTAINER.scrollTop = this.SCROLL_CONTAINER.scrollHeight;
  }

  private removeMessageFromInputField() {
    (<HTMLTextAreaElement>(this.TEXTAREA_OBJ)).value = '';
  }

  // eslint-disable-next-line class-methods-use-this
  private getHTMLMessageContainer(userName: String, textMessage: string, areMessageOwner: Boolean) {
    const TIME = new Date().toLocaleTimeString();
    const CONTAINER: HTMLDivElement = document.createElement('div');
    const USER_INFO_CONTAINER = document.createElement('div');

    USER_INFO_CONTAINER.innerHTML = `${areMessageOwner ? '' : userName} ${TIME}`;
    CONTAINER.className = areMessageOwner ? 'user-sock-info' : 'someone-sock-info';
    USER_INFO_CONTAINER.className = 'messInfo';

    CONTAINER.innerHTML = textMessage;
    CONTAINER.appendChild(USER_INFO_CONTAINER);

    return CONTAINER;
  }
}

export { ChatViewModelInterface, ChatViewModel };
