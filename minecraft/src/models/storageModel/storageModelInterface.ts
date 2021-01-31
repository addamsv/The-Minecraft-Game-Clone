/* eslint-disable no-unused-vars */
import ServerSocketModelInterface from '../socketModel/ServerSocketModelInterface';

interface StorageModelInterface {

  /**
   * Init StorageModel when Socket is ready
   * @param socket Socket
   */
  init(socket: ServerSocketModelInterface): void;

  /** Answer will be in the socket
   * this.model.storageModel.sendStatQueryToServer('{"ask": "setStat", "item1": "yourString"}');
   * @param stat - String - serialized JSON Object:
   *
   ** In order to Send Statistics To the Heroku Server Through Socket
   * warning! required: {"ask": "setStat", ... }
   *
   * * In order to Get Statistics from the Heroku Server Through Socket
   * example: `{"getStat": "${yourID}", "getStat": "all"}`
   * warning! required: {"ask": "getStat", ... }
   */
  sendStatQueryToServer(stat: String): void;

  /** Answer will be in the socket
  * this.model.storageModel.sendSettsQueryToServer('{"ask": "setSetts", "item1": "yourString"}');
  * @param stat -  String - serialized JSON Object:
   *
   *  Send Settings To the Heroku Server Through Socket
   * example: `{"ask": "setSetts", "item1": "${itemVal1}, ...}`
   * warning! required: {"ask": "setSetts", ... }
   *
   ** Get Settings from the Heroku Server Through Socket
   * example: `{"ask": "getSetts", "getSetts": "all"}`
   * warning! required: {"ask": "getSetts", ... }
   */
  sendSettsQueryToServer(setts: String): void;
}

export default StorageModelInterface;
