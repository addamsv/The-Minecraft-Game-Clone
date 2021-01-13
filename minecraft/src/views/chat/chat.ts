import MainModelInterface from '../../models/mainModelInterface';

class Chat {
  model: MainModelInterface;

  container: HTMLDivElement;

  input: HTMLTextAreaElement;

  constructor(model: MainModelInterface) {
    this.model = model;

    this.container = document.createElement('div');
    const scrollContainer = document.createElement('div');
    const sockContainer = document.createElement('div');
    const sockInfo = document.createElement('div');
    this.input = document.createElement('textarea');

    this.container.id = 'chat-container';
    scrollContainer.id = 'scroll-container';
    sockContainer.id = 'sock-container';
    sockInfo.id = 'sock-info';
    this.input.id = 'sock-msg';
    this.input.placeholder = 'Please Enter Your Message';
    this.input.autofocus = true;

    this.container.classList.add('hide');

    sockContainer.appendChild(sockInfo);
    scrollContainer.appendChild(sockContainer);
    this.container.append(scrollContainer, this.input);
    document.body.appendChild(this.container);
  }

  toggle() {
    this.container.classList.toggle('hide');
  }
}

export default Chat;
