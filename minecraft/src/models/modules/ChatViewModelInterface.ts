/* eslint-disable no-unused-vars */

interface ChatViewModelInterface {
  appendSysMessage(textMessage: string): void;

  appendMessage(userName: String, textMessage: string, areYouMessageOwner: Boolean): void;
}

export default ChatViewModelInterface;
