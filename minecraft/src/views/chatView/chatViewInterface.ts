/* eslint-disable no-unused-vars */

interface ChatViewInterface {
  appendSysMessage(message: string): void;
  appendMessage(name: string, message: string, areYouMessageOwner: boolean): void;
  connect(): any;
  disconnect(): any;
}

export default ChatViewInterface;
