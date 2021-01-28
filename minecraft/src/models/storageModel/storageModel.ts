import StorageModelInterface from './storageModelInterface';
import ServerSocketModelInterface from '../socketModel/ServerSocketModelInterface';
import MainControllerInterface from '../../controllers/mainControllerInterface';

class StorageModel implements StorageModelInterface {
  private controller: MainControllerInterface;

  private serverSocket: ServerSocketModelInterface;

  constructor(controller: MainControllerInterface) {
    this.controller = controller;
    this.serverSocket = null;
  }

  public init(serverSocket: ServerSocketModelInterface) {
    this.serverSocket = serverSocket;
  }

  public sendStatQueryToServer(stat: string) {
    if (this.serverSocket) {
      this.serverSocket.sendMessage(stat, 'stat');
    }
  }

  public sendSettsQueryToServer(setts: string) {
    if (this.serverSocket) {
      this.serverSocket.sendMessage(setts, 'setts');
    }
  }
}

export { StorageModelInterface, StorageModel };
